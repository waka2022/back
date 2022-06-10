/***********/
//*! Importaciones
    //* |-> { Router } - express
    import { Router } from 'express'
    //* |-> Controladores
    import { changeStatusBooking, createBooking, uploadNewsVehicle, viewAllBookings, viewAllBookingsUser, viewTimeParkedVehicle, viewUniqueBookingId } from '../controllers/bookings.controller'
import { checkedResults } from '../middlewares/checked_camps.middleware'
    //* |-> Middlewares
    import { valid_jwt } from '../middlewares/valid_jwt.middleware'
import { check } from 'express-validator';
/***********/
//? -_ Inicializacion de rutas
const router: Router = Router()
/***********/
//? -_ Definicion de rutas
    //? $GET
        //* |-> Ruta que mostrara todas las reservas que tiene un parqueadero
        router.get(
            '/view-reservatios-all/:id_park/:h_r',
            [ valid_jwt ],
            viewAllBookings
        )
        //* |-> Ruta  que mostrara una reserva segun su id
        router.get(
            '/view-reservation-unique/:id_booking',
            [ valid_jwt ],
            viewUniqueBookingId
        )
        //* |-> Ruta que devolvera el tiempo que el vehiculo lleva estacionado
        router.get(
            '/view-time-parking-vehicle/:id_booking',
            [ valid_jwt ],
            viewTimeParkedVehicle
        )
        //* |-> Ruta que mostrara todas las reservas activas de un usuario
        router.get(
            '/view-reservations-all-user/:h_r',
            [ valid_jwt ],
            viewAllBookingsUser
        )
    //? $POST
        //* |-> Ruta que creara una reserva
        router.post(
            '/request-reservation',
            [ 
                valid_jwt,
                check('id_park', 'El indicativo unico del parqueadero es obligatorio').not().isEmpty(),
                check('id_vehicle', 'El indicativo unico del vehiculo es obligatorio').not().isEmpty(),
                checkedResults
            ],
            createBooking
        )
    //? $PUT
        //* |-> Ruta que cambiara el estado de la reserva
        router.patch(
            '/change-status-reservation/:id_booking/:journey',
            [ valid_jwt ],
            changeStatusBooking
        )
        //* |-> Ruta que traera las urls y las almacenara para las novedades de la reserva
        router.patch(
            '/add-photos-new/:id_booking',
            [ valid_jwt ],
            uploadNewsVehicle
        )
    //? $DELETE
/***********/
// TODO -> Exportacion por defecto de las rutas
export default router