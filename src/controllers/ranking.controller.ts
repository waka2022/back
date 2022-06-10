/***********/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> Models
        //? -> Ranking
        import Ranking from '../models/ratings.model'
        //? -> Parking
        import Parking from '../models/parking.model'
    //* |-> Interfaces
    import { _ranking_register } from '../interface/interface.interface'
    //* |-> Environments
    import { _cloud_product_ } from '../environments/environments'
    //* |-> Services
    import { $Response } from '../services/resp.services'
/***********/
//? -_ Controlador que mostrara el promedio del calificacion de un parqueadero
const viewAverageParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del parqueadero de los parametros URL
    const { id_park }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos las calificaciones posteadas
        const findRankingParkingId = await Ranking.find({ id_parking: id_park })
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findRankingParkingId || findRankingParkingId.length === 0) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, no se encuentran calificaciones del parqueadero seleccionado', data: 0 }
            )
        }
        //* |-> Variable que mantendra la sumatoria total de los rankings
        let totalsRanking: number = 0
        findRankingParkingId.forEach(({ranking}) => {
            totalsRanking += ranking
            return totalsRanking
        });
        //* |-> Variable que calculara el promedio de ranking del parqueadero
        const proRanking = totalsRanking / findRankingParkingId.length
        //* |-> Retornamos un mensaje de exito al usuario que hizo la peticion 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa', data: proRanking }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que registrara el ranking de un parqueadero posteado por un usuario
const registerRanking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el cuerpo de la peticion
    const body: _ranking_register = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos al parqueadero al que se le registrara el ranking
        const findParkingId = await Parking.findById(body.id_parking)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, el parqueadero al que quieres calificar no esta registrado en nuestro sistema waka!' }
            )
        }
        //* |-> Validamos que el usuario que hace la peticion sea un usuario bp
        if (user_t.parking === true) {
            //* |-> Si es un parqueadero retornaremos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos, un parqueadero no puede calificar a otro' }
            )
        }
        //* |-> Armamos el cuerpo que almacenaremos en la base de datos
        const ranking = {
            id_user: user_t._id,
            ...body
        }
        //* |-> Agregamos el nuevo modelo
        const new_ranking = new Ranking(ranking)
        //* |-> Almacenamos en el dbms
        new_ranking.save()
        //* |-> Respondemos al cliente que hizo la peticion un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'La calificacion que le diste al parqueadero fue registrada exitosamente!' }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/***********/
// TODO -> Exportacion del modulo
export {
    registerRanking,
    viewAverageParking
}