/***********/
//*! Importaciones
//* |-> { Next, Request, Response } - (express)
import { NextFunction, Request, Response } from 'express'
//* |-> jsonwebtoken
import jwt, { JwtPayload } from 'jsonwebtoken'
//* |-> Environments
import { _secret_token_, _cloud_product_, _secret_token_files_, _key_files_ } from '../environments/environments'
//* |-> Funcion para la comprobacion de usuarios
import { comFindUserId } from '../functions/comprobante.funtion'
//* |-> Servicio para las respuestas
import { $Response } from '../services/resp.services'
/***********/
//? -> Middleware que validara el token
const valid_jwt = async (req: Request | any, res: Response, next: NextFunction) => {
    //* |-> Capturamos el token por la request en los headers
    const token: string | any = req.header('authorization_token')
    //* |-> Si no resive algun token retornaremos un error 401
    if (!token || token === null || token === undefined) {
        return $Response(
            res,
            {
                status: 401,
                succ: false,
                msg: `${_cloud_product_ === 'false' ? 'Peticion no autorizada por falta de token' : 'Lo sentimos, No podemos recibir tu peticion ya que careces de permisos para esta solicitud!'}`
            }
        )
    }
    //* |-> Control de errores tryCatch
    try {
        //* |-> Extraemos el id del usuario que hace la peticion
        const { id }: string | JwtPayload | any = await jwt.verify(String(token), _secret_token_)
        //* |-> Buscamos si el usuario existe en el sistema
        const findUserId = await comFindUserId(id, res)
        //* |-> Si existe retornaremos por la request el usuario completo
        req.user_t = findUserId
        //* |-> Devolveremos el token
        req.token = token
        //* |-> Continuamos la funcionalidad
        next()
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos un error 500 al cliente que hizo la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -> Middleware que validara el token de los parametros
const valid_jwt_params = async (req: Request | any, res: Response, next: NextFunction) => {
    //* |-> Capturamos el token por la request en los headers
    const { token }: string | any = req.params
    //* |-> Si no resive algun token retornaremos un error 401
    if (!token || token === null || token === undefined) {
        return $Response(
            res,
            {
                status: 401,
                succ: false,
                msg: `${_cloud_product_ === 'false' ? 'Peticion no autorizada por falta de token' : 'Lo sentimos, No podemos recibir tu peticion ya que careces de permisos para esta solicitud!'}`
            }
        )
    }
    //* |-> Control de errores tryCatch
    try {
        //* |-> Extraemos el id del usuario que hace la peticion
        const { id }: string | JwtPayload | any = await jwt.verify(String(token), _secret_token_)
        //* |-> Buscamos si el usuario existe en el sistema
        const findUserId = await comFindUserId(id, res)
        //* |-> Si existe retornaremos por la request el usuario completo
        req.user_t = findUserId
        //* |-> Devolveremos el token
        req.token = token
        //* |-> Continuamos la funcionalidad
        next()
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos un error 500 al cliente que hizo la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -> Middleware que validara el token de las peticiones waka <-> waka_files
const valid_jwt_files = async(req: Request, res: Response, next: NextFunction) => {
    //* |-> Capturamos el token por la request en los headers
    const token: string | any = req.header('Authorization-files')
    //* |-> Capturamos la key por la request en los headers
    const key: string | any = req.header('x-key')
    //* |-> Validamos si existen o llegan las dos claves
    if (!token || token === null || token === undefined && !key || key === null || key === undefined) {
        //* |-> Si no llegan retornaremos un error 401
        return $Response(
            res,
            { status: 401, succ: false, msg: `No es posible validar la entrada de waka files :(` }
        )
    }
    //* |-> Control de errores tryCatch
    try {
        //* |-> Extraemos el { secrect } proveniente de el payload del token de waka_files
        const { secrect }: string | any = jwt.verify(String(token), _secret_token_files_)
        //* |-> Validamos que la key de los headers sea la misma que en payload
        if (String(key) !== String(secrect)) {
            //* |-> Si no son iguales retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: 'No es pocible establecer conexion punto a punto con waka files :(' }
            )
        }
        //* |-> Si son iguales continuaremos con la funcionalidad del controlador
        next()
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos un error 500 al cliente que hizo la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/***********/
// TODO -> Exportacion de middlewares
export {
    valid_jwt,
    valid_jwt_params,
    valid_jwt_files
}
