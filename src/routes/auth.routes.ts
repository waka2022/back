/*********/
//*! Importaciones
    //* |-> { Routes } - express
    import { Router } from "express"
    //* |-> Controladores de autentificacion
    import { signIn, renewTokenAccount, signInGoogle } from '../controllers/auth.controller'
    //* |-> Middleware
    import { valid_jwt } from "../middlewares/valid_jwt.middleware"
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
            signIn
        )
        //* |-> Ruta para el logueo con google
        router.post(
            '/google',
            signInGoogle
        )
        //* |-> Solicitud de verificacion de email
        /*router.post(
            '/request-verify-email'

        )*/
    //? $PUT
    //? $DELETE
/*********/
// TODO -> Exportacion de modulo
export default router