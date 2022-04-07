/*********/
//*! Importaciones
    //* |-> { Routes } - express
    import { Router } from "express"
    //* |-> Controladores de autentificacion
    import { signIn, renewTokenAccount, signInGoogle, accountRequests, verifiAtAccount, actAccount, rePassAccount } from '../controllers/auth.controller'
    //* |-> Middleware
    import { valid_jwt, valid_jwt_params } from "../middlewares/valid_jwt.middleware"
    import { checkedResults } from "../middlewares/checked_camps.middleware"
    import { check } from 'express-validator';
/*********/
//? -_ Declaracion de rutas
const router: Router = Router()
/*********/
//? -> Definicion de rutas
    //? $GET
        //* |-> Ruta que renovara un token
        router.get(
            '/renew-token/:tok',
            [ valid_jwt ],
            renewTokenAccount
        )
    //? $POST
        //* |-> Ruta que logeara al usuario por formulario
        router.post(
            '/normal',
            [
                check('email', 'El correo del usuario es obligatorio').not().isEmpty().isEmail(),
                check('password', 'La contraseña del usuario es obligatorio').not().isEmpty(),
                checkedResults
            ],
            signIn
        )
        //* |-> Ruta para el logueo con google
        router.post(
            '/google',
            signInGoogle
        )
        //* |-> Solicitudes para la gestion de { verificacion, cambio de contraseña, reactivacion de cuenta }
        router.post(
            '/request-emails-account/:request',
            [
                check('email', 'El correo del usuario es obligatorio').not().isEmpty(),
                checkedResults
            ],
            accountRequests
        )
    //? $PUT
        //* |-> Ruta para la verificacion de la cuenta
        router.put(
            '/verify-account/:token',
            [ valid_jwt_params ],
            verifiAtAccount
        )
        //* |-> Ruta que activara una cuenta
        router.put(
            '/activation-account/:token',
            [ valid_jwt_params ],
            actAccount
        )
        //* |-> Ruta que restablecera la contraseña de un usuario
        router.put(
            '/reset-password/:token',
            [ valid_jwt_params ],
            rePassAccount
        )
    //? $DELETE
/*********/
// TODO -> Exportacion de modulo
export default router