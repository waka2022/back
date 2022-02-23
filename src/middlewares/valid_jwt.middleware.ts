/***********/
//*! Importaciones
    //* |-> { Next, Request, Response } - (express)
    import { NextFunction, Request, Response } from 'express'
    //* |-> jsonwebtoken
    import jwt, { JwtPayload } from 'jsonwebtoken'
    //* |-> Environments
    import { _secret_token_, _cloud_product_ } from '../environments/environments'
    //* |-> Modelo de usuarios
    import Users from '../models/user.model'
    //* |-> Servicio para las respuestas
    import { $Response } from '../services/resp.services'
/***********/
//? -> Middleware que validara el token
const valid_jwt = async(req: Request | any, res: Response, next: NextFunction) => {
    //* |-> Capturamos el token por la request en los headers
    const token: string | any = req.header('authorization_token')
    //* |-> Si no resive algun token retornaremos un error 401
    if (!token || token === null || token === undefined) {
        return $Response(
            res, 
            { 
                status: 401, 
                succ: false, 
                msg: `${ _cloud_product_ === 'false' ? 'Peticion no autorizada por falta de token' : 'Lo sentimos, No podemos recibir tu peticion ya que careces de permisos para esta solicitud!' }` 
            }
        )
    }
    //* |-> Control de errores tryCatch
    try {
        //* |-> Extraemos el id del usuario que hace la peticion
        const { id }: string | JwtPayload | any = await jwt.verify(String(token), _secret_token_)
        //* |-> Buscamos si el usuario existe en el sistema
        const findUserId = await Users.findById(id)
        //* |-> Si no encuentra ningun resultado retornaremos un error 404
        if (!findUserId || findUserId === null || findUserId == undefined) {
            return $Response(res, { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encontro el usuario por el id suministrado' : 'Lo sentimos, No se encontro el usuario por el id suminstrado' }` })
        }
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
        return $Response(res, { status: 500, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!' }` })
    }
}
/***********/
// TODO -> Exportacion de middlewares
export {
    valid_jwt
}
