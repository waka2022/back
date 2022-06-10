/*********/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> Services
    import { $Response } from '../services/resp.services';
    //* |-> Environments
    import { _cloud_product_, _user_mongo_, _pass_mongo_, _url_waka_files_, _key_files_ } from '../environments/environments'
    //? Models
        //* |-> User
        import User from '../models/user.model'
        //* |-> Parking
        import Parking from '../models/parking.model'
        //* |-> Vehicle
        import Vehicle from '../models/vehicle.model'
        //* |-> Reservacion
        import Booking from '../models/booking.model'
    //* |-> Helpers
    import { generateJWTwakaFilesConnection, generateJWTwakaFilesInfo } from '../helpers/jwt.helper';
    //* |-> Axios
    import axios from 'axios'
    //* |-> file systems
    import fs from 'fs'
    //* |-> path
    import path from 'path'
/*********/
//? -_ Controlador que entregara informacion sencible del dbms { user, pass }
const credentials = async(req: Request, res: Response) => {
    //* |-> Control de errores tryCatch
    try {
        //* |-> Respondemos con las credenciales en uso de la base de datos
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Entrega punto a punto de credenciales exitosamente realizado!', data: { user: _user_mongo_, pass: _pass_mongo_ } }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que validara y entregara la informacion para almacenar la informacion
const uploadPhoto = async(req: Request | any, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el type y el id_type
    const body: { type: number, id_type: string } | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Armaremos el cuerpo base del token
        const data_info = {
            id_user: String( user_t._id),
            type: body.type
        }
        let types
        //* |-> Resultado final del token
        let result_token: {id_user: string, type: number, id_vehicle?: string, id_parking?: string}
        //* |-> Dependiendo del type
        switch (Number(body.type)) {
            case 1: //* |-> Reservacion
                    //* |-> Buscaremos si existe algun vehiculo con el id suministrado
                    const findBookingId = await Booking.findById(body.id_type)
                    //* |-> Validamos que encuentre algun documento relacionado
                    if (!findBookingId || findBookingId === null || findBookingId === undefined) {
                        //* |-> Si no encuentra ningun documento retornaremos un error 404
                        return $Response(
                            res,
                            { status: 404, succ: false, msg: 'Lo sentimos pero no se encontro el vehiculo al que se adjuntaran dichas imagenes' }
                        )
                    }
                    //* |-> Variable que almacenara el id_vehiculo
                    types = {
                        id_booking: body.id_type
                    }
                break;
            case 2: //* |-> parqueadero
                    //* |-> Buscaremos si existe algun parqueadero con el id suministrado
                    const findParkingeId = await Parking.findById(body.id_type)
                    //* |-> Validamos que encuentre algun documento relacionado
                    if (!findParkingeId || findParkingeId === null || findParkingeId === undefined) {
                        //* |-> Si no encuentra ningun documento retornaremos un error 404
                        return $Response(
                            res,
                            { status: 404, succ: false, msg: 'Lo sentimos pero no se encontro el parqueadero al que se adjuntaran dichas imagenes' }
                        )
                    }
                    
                    //* |-> Variable que almacenara el id_vehiculo
                    types = {
                        id_parking: body.id_type
                    }
                break;
            default:
                break;
        }
        //* |-> Agregamos al objeto principal de la peticion
        result_token = Object.assign(data_info, types)
        //* |-> Respondemos un mensaje de exito con el objeto principal
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Entrega de objeto principal', data: result_token }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/*********/
// TODO -> Exportacion del modulo
export {
    credentials,
    uploadPhoto
}