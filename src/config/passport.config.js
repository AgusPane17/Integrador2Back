import passport from "passport";
import UserModel from '../models/user.model.js'
import CartModel from '../models/cart.model.js'
import GithubStrategy from 'passport-github2'
import passportJWT from 'passport-jwt'
import { extractCookie, generateToken } from "../utils.js";

const JWTstrategy = passportJWT.Strategy
const JWTextract = passportJWT.ExtractJwt

const initializePassport = () => {

    // Login and Register
    passport.use('github', new GithubStrategy(
        {
            clientID: "Iv1.3f46cc88f07df090",
            clientSecret: "297e35e96c79461c8ce756c9e427e676ba3c369a",
            callbackURL: "http://localhost:8080/session/githubcallback"
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('profile: ')
            console.log(profile)
            
            try {
                const email = profile._json.email
                console.log('email: ')
                console.log({ email })
                let user = await UserModel.findOne({ email }).lean().exec()
                if(user) {
                    console.log('User already exits!!')
                    return done(null, user)
                } else {
                    console.log(`User doesn't exits. So register them`)


                    const newCart = await CartModel.create({productos: []}) 

                    console.log(newCart)
                    const newUser = {
                        first_name: profile._json.name,
                        last_name :'',
                        email: profile._json.email,
                        password: '',
                        cart: newCart._id,
                        social: 'github',
                        role: 'user'
                    }
                    console.log('User: ')
                    console.log(newUser)
                    user = await UserModel.create(newUser)
                    console.log('User: ')
                    console.log(user)
                    const token = generateToken(user)
                    user.token = token
    
                    return done(null, user)
                }
                

            } catch (e) {
                return done('Error to login whit github: ' + e) 
            }
        }
    ))

    // Autenticacion. Extrae y valida el JWT
    passport.use('jwt', new JWTstrategy(
        {
            jwtFromRequest: JWTextract.fromExtractors([extractCookie]),
            secretOrKey: 'secretForJWT'
        },
        (jwt_payload, done) => {
            console.log( { jwt_payload } )
            return done(null, jwt_payload)
        }
    ))

    passport.serializeUser(async (user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        return user
    })
}

export default initializePassport