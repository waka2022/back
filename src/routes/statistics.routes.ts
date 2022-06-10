/*************/
//*! Importaciones
    //* |-> { Router } - express
    import { Router } from 'express'
    //* |-> Controllers
    import { statisticTypeVehiParking, totalsParnetRangeDateOrDay } from '../controllers/statistics.controller'
    //* |-> Middlewares
    import { valid_jwt } from '../middlewares/valid_jwt.middleware'
/*************/
//? -> Definicion de variable que contendra las rutas
const router: Router = Router()
/*************/
//? -_ Definicion de rutas
    //? $GET
        //* |-> Ruta que mostrara las estadisticas de los vehiculos parqueados
        router.get(
            '/graff/:start_date/:end_date/:filters/:id_park',
            [ valid_jwt ],
            statisticTypeVehiParking
        )
        //* |-> Ruta que mostrara el total de ganancias por un rango de fechas o del dia
        /**
         * ? -> Path: {{url_static}}/totals/:id_park/:day_range?start=date&end=date
         */
        router.get(
            '/totals/:id_park/:day_range',
            [ valid_jwt ],
            totalsParnetRangeDateOrDay
        )
    //? $POST
    //? $PUT
    //? $DELETE
/*************/
// TODO -> Exportacion por defecto de rutas
export default router