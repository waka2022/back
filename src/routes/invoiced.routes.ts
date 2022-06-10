/***********/
//*! Importaciones
    //* |-> { Router } - express
    import { Router } from 'express'
    //* |-> Middlewares
    import { valid_jwt } from '../middlewares/valid_jwt.middleware'
    //* |-> Controladores
    import { createInvoiced, parnetInvoicedBookingId, viewAllInvoicedParking, viewUniqueInvoiced } from '../controllers/invoiced.controller'
/***********/
//? -_ Variable que definira las rutas
const router: Router = Router()
/***********/
//? -> Definicion de variables
    //? $GET
        //* |-> Ruta que mostrara la factura segun el id de la reserva
        router.get(
            '/view-invoiced/:id_booking',
            [ valid_jwt ],
            viewAllInvoicedParking
        )
        //* |-> Ruta que mostrara una factura segun su id
        router.get(
            '/view-unique-invoiced/:id_invoiced',
            [ valid_jwt ],
            viewUniqueInvoiced
        )
    //? $POST
        //* |-> Ruta que creara la factura y almacenara en el dbms
        router.post(
            '/register/:id_booking',
            [ valid_jwt ],
            createInvoiced
        )
    //? $PUT
        //* |-> Ruta que actualizara el estado de una factura a pago
        router.patch(
            '/parnet-invoiced/:id_booking',
            [ valid_jwt ],
            parnetInvoicedBookingId
        )
    //? $DELETE
/***********/
// TODO -> Exportacion del modulo
export default router