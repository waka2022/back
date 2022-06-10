/***********/
//*! Importaciones
    //* |-> { Router } - express
    import { Router } from 'express'
    //* |-> Middleware
    import { valid_jwt } from '../middlewares/valid_jwt.middleware'
    //* |-> Controladores
    import { createParking, deleteParking, photosParking, updateParking, updateUbiParking, viewAllAbilityParking, viewAllParking, viewUniqueParking } from '../controllers/parking.controller'
import { checkedResults } from '../middlewares/checked_camps.middleware'
import { check } from 'express-validator'
/***********/
//? -> Definicion de la variable que almacenara las rutas
const router: Router = Router()
/***********/
//? -_ Definicion de rutas
    //? $GET
        //* |-> Ruta que mostrara todos los parqueaderos inscritos por un usuario parqueadero
        router.get(
            '/view-parking-user',
            [ valid_jwt ],
            viewAllParking
        )
        //* |-> Ruta que mostrara un parqueadero segun su id
        router.get(
            '/view-parking-unique/:id_park',
            [ valid_jwt ],
            viewUniqueParking
        )
        //* |->
        router.get(
            '/view-all-parking-available',
            [ valid_jwt ],
            viewAllAbilityParking
        )
    //? $POST
        //* |-> Ruta que creara un nuevo parqueadero
        router.post(
            '/add-parking-user',
            [ 
                valid_jwt,
                check('address', 'La direccion del parqueadero es obligatoria').not().isEmpty(),
                check('type_parks._0', 'El tipo moto de almacenamiento del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('type_parks._1', 'El tipo carro de almacenamiento del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('type_parks._2', 'El tipo bicicleta de almacenamiento del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('type_security.cams', 'El tipo de seguridad (Camara) es obligatorio').not().isEmpty().isBoolean(),
                check('type_security.vigilant', 'El tipo de seguridad (Vigilante) es obligatorio').not().isEmpty().isBoolean(),
                check('availability', 'La disponibilidad del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('quotas', 'Los cupos del parqueadero es obligatorio').not().isEmpty(),
                check('space', 'El espacio del parqueadero es obligatorio').not().isEmpty(),
                checkedResults
            ],
            createParking
        )
    //? $PUT
        //* |-> Ruta que actualizara un parqueadero segun su id
        router.put(
            '/update-parking-user/:id_park',
            [ 
                valid_jwt,
                check('address', 'La direccion del parqueadero es obligatoria').not().isEmpty(),
                check('type_parks._0', 'El tipo moto de almacenamiento del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('type_parks._1', 'El tipo carro de almacenamiento del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('type_parks._2', 'El tipo bicicleta de almacenamiento del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('type_security.cams', 'El tipo de seguridad (Camara) es obligatorio').not().isEmpty().isBoolean(),
                check('type_security.vigilant', 'El tipo de seguridad (Vigilante) es obligatorio').not().isEmpty().isBoolean(),
                check('availability', 'La disponibilidad del parqueadero es obligatorio').not().isEmpty().isBoolean(),
                check('quotas', 'Los cupos del parqueadero es obligatorio').not().isEmpty(),
                check('space', 'El espacio del parqueadero es obligatorio').not().isEmpty(),
                checkedResults
            ],
            updateParking
        )
        //* |-> Ruta que añadira o actualizar la ubicacion de un parqueadero segun su id
        router.put(
            '/add-ubi-parking/:id_park',
            [ 
                valid_jwt,
                check('ubi.lon', 'La longitud de la ubicacion es obligatorio').not().isEmpty().isNumeric(),
                check('ubi.lat', 'La latitud de la ubicacion es obligatorio').not().isEmpty().isNumeric(),
                checkedResults
            ],
            updateUbiParking
        )
        //* |-> Ruta que actualizara el arreglo de imagenes para un parqueadero
        router.patch(
            '/photos-parking/:id_park/:act',
            [ valid_jwt ],
            photosParking
        )
    //? $DELETE
        //* |-> Ruta que eliminara un parqueadero segun su id
        router.delete(
            '/delete-parking-user/:id_park',
            [ valid_jwt ],
            deleteParking
        )
/***********/
// TODO -> Exportacion del modulo de rutas
export default router