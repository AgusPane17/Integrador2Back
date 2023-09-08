import { Router } from "express";
import passport from "passport";

const router = Router();

// Middleware personalizado
const merequetengue = (req, res, next) => {
    console.log('funca');
    next();
};

// Ruta para la página de inicio
router.get('/home', (req, res) => {
    console.log('HOME');
    res.render('home');
});

// Ruta para iniciar sesión con GitHub
router.get('/login-github',
    passport.authenticate('github', { scope: ['user:email'] }),
    merequetengue,
    (req, res) => {}
);

// Ruta de devolución de llamada de GitHub
router.get('/githubcallback',
    merequetengue,
    passport.authenticate('github', { failureRedirect: '/fail-github' }),
    (req, res) => {
        try {
            console.log('Callback:', req.user);
            res.cookie('keyCookieForJWT', req.user.token).redirect('/session/home');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en la devolución de llamada de GitHub');
        }
    }
);

// Ruta para el caso de inicio de sesión fallido
router.get('/fail-github', (req, res) => {
    res.render('fail_login', {});
});

// Ruta para ver el perfil del usuario actual
router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        try {
            const { user } = req; // const user = req.user
            console.log(user);
            res.render('profile', user);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener el perfil del usuario');
        }
    }
);

export default router;
