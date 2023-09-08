import mongoose from "mongoose";

const UserModel =  mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    social: String,
    role: String
}))

export default UserModel