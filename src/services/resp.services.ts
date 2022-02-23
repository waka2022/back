/*********/
//*! Importaciones
    //* |-> { Response } - express
    import { Response } from 'express'
    //* |-> Interfaces
    import { _resp } from '../interface/interface.interface'
/*********/
//? -_ Servicio que tendra las respuestas del servidor
const $Response = async(res: Response, data: _resp) => {
    return res.status(data.status).json({
        success: data.succ,
        msg: data.msg,
        data: data.data
    })
}
/*********/
// TODO -> Exportacion de servicios
export {
    $Response
}