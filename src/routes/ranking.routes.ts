/***********/
//*! Importaciones
    //* |-> { Router } - express
    import { Router } from 'express'
    //* |-> Middlewares
    import { valid_jwt } from '../middlewares/valid_jwt.middleware'
    //* |-> Controladores
    import { registerRanking, viewAverageParking } from '../controllers/ranking.controller'
/***********/
//? -> Variable que definira las rutas
const router: Router = Router()
/***********/
//? -_ Definicion de rutas
    //? $GET
        //* |-> Ruta que mostrara el promedio del calificacion de un parqueadero
        router.get(
            '/average-ranking-parking/:id_park',
            [ valid_jwt ],
            viewAverageParking
        )
    //? $POST
        //* |-> Ruta que registrara un ranking a un parqueadero
        router.post(
            '/register-ranking',
            [ valid_jwt ],
            registerRanking
        )
    //? $PUT
    //? $DELETE
/***********/
// TODO -> Exportacion del modulo
export default router