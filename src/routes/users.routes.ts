/*********/
//*! Importaciones
    //* |-> { Routes } - express
    import { Router } from "express";
    //* |-> Controladores { Users }
    import { addInfoUser, disableAccount, photoProfile, registerUser, updateInfoUser, viewUserId } from '../controllers/users.controller'
    //* |-> Middlewares
    import { valid_jwt } from "../middlewares/valid_jwt.middleware";
    import { checkedResults } from '../middlewares/checked_camps.middleware'
    import { check } from 'express-validator'
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
            [
                check('name', 'Los nombre del usuario son obligatorios').not().isEmpty(),
                check('email', 'El correo del usuario es obligatorio').not().isEmpty().isEmail(),
                check('password', 'La contraseña del usuario es obligatorio').not().isEmpty(),
                checkedResults
            ],
            registerUser
        )
    //? $PUT
        //? -> Ruta que añadira la informacion adicional
        router.put(
            '/add-info',
            [ 
                valid_jwt,
                check('document', 'El documento del usuario es obligatoria').not().isEmpty(),
                check('phone', 'El telefono del usuario es obligatorio').not().isEmpty(),
                check('parking', 'El estado del parqueadero es obligatorio').not().isEmpty(),
                checkedResults
            ],
            addInfoUser
        )
        //? -> Ruta que actualizara la informacion de un usuario
        router.put(
            '/update-info-user',
            [ 
                valid_jwt,
                check('names', 'Los nombre del usuario son obligatorios').not().isEmpty(),
                check('email_t.email', 'El correo del usuario es obligatorio').not().isEmpty().isEmail(),
                checkedResults
            ],
            updateInfoUser
        )
        //? -> Ruta que actualizara la imagen de perfil
        router.patch(
            '/photo-profile',
            [ valid_jwt ],
            photoProfile
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