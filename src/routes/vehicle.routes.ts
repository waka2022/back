/**********/
//*! Importaciones
    //* |-> { Router } - express
    import { Router } from 'express'
    //* |-> Middleware
    import { valid_jwt } from '../middlewares/valid_jwt.middleware'
    //* |-> Controllador de vehiculos
    import { changeStatusVehicle, createVehicle, deleteVehicle, photoVehicle, updateVehicle, viewVehicleUnique, viewVehicleUser } from '../controllers/vehicle.controller';
import { checkedResults } from '../middlewares/checked_camps.middleware';
import { check } from 'express-validator';
/**********/
//? -_ Definicion de variable para rutas
const router: Router = Router()
/**********/
//? -> Definicion de rutas
    //? $GET
        //* |-> Ruta que mostrara todos los vehiculos de un usuario inscrito en el sistema
        router.get(
            '/view-my-vehicles',
            [ valid_jwt ],
            viewVehicleUser
        )
        //* |-> Ruta que mostrara un vehiculo segun su id
        router.get(
            '/view-unique-vehicle/:id_vehi',
            [ valid_jwt ],
            viewVehicleUnique
        )
    //? $POST
        //* |-> Ruta que creara un vehiculo
        router.post(
            '/add-vehicle-user',
            [ 
                valid_jwt,
                check('type_vehi.global', 'El tipo de vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.mark', 'La marca de vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.model', 'El modelo del vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.placa', 'La placa del vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.color', 'El color del vehiculo es obigatorio').not().isEmpty(),
                checkedResults
            ],
            createVehicle
        )
    //? $PUT
        //* |-> Ruta que actualizara un vehiculo
        router.put(
            '/update-vehicle-user/:id_vehi',
            [ 
                valid_jwt,
                check('type_vehi.global', 'El tipo de vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.mark', 'La marca de vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.model', 'El modelo del vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.placa', 'La placa del vehiculo es obigatorio').not().isEmpty(),
                check('type_vehi.color', 'El color del vehiculo es obigatorio').not().isEmpty(),
                checkedResults
            ],
            updateVehicle
        )
        //* |-> Ruta que cambiara el estado del vehiculo en uso
        router.patch(
            '/status-change-vehicle/:id_vehi',
            [ valid_jwt ],
            changeStatusVehicle
        )
        //* |-> Ruta que actualizara la ubicacion de las imagenes para un vehiculo
        router.patch(
            '/photo-vehicle/:id:vehicle/:act',
            [ valid_jwt ],
            photoVehicle
        )
    //? $DELETE
        //* |-> Ruta que eliminara un vehiculo
        router.delete(
            '/delete-vehicle-user/:id_vehi',
            [ valid_jwt ],
            deleteVehicle
        )
/**********/
// TODO -> Exportacion del modulo de rutas
export default router;