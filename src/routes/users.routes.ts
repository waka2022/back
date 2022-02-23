/*********/
//*! Importaciones
    //* |-> { Routes } - express
    import { Router } from "express";
    //* |-> Controladores { Users }
    import { addInfoUser, disableAccount, registerUser, updateInfoUser, viewUserId } from '../controllers/users.controller'
    //* |-> Middlewares
    import { valid_jwt } from "../middlewares/valid_jwt.middleware";
/*********/
//? -_ Declaracion de rutas
const router: Router = Router()
/*********/
//? -> Definicion de rutas
    //? $GET
        //? -> Ruta que mostrara un usuario segun su id
        router.get(
            '/unique-user',
            [ valid_jwt ],
            viewUserId
        )
    //? $POST
        //? -> Ruta que creara usuarios
        router.post(
            '/',
            registerUser
        )
    //? $PUT
        //? -> Ruta que añadira la informacion adicional
        router.put(
            '/add-info',
            [ valid_jwt ],
            addInfoUser
        )
        //? -> Ruta que actualizara la informacion de un usuario
        router.put(
            '/update-info-user',
            [ valid_jwt ],
            updateInfoUser
        )
    //? $DELETE
        //? -> Rut que inhabilitara una cuenta
        router.delete(
            '/disable-account',
            [ valid_jwt ],
            disableAccount
        )
/*********/
// TODO -> Exportacion de modulo
export default router