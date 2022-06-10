/*********/
//*! Importaciones
    //* |-> User models
    import User from '../models/user.model'
    //* |-> { Response } express
    import { Response } from 'express'
    //* |-> Servicios
    import { $Response } from '../services/resp.services'
    //* |-> Environments
    import { _cloud_product_ } from '../environments/environments'
/*********/
//? -_ Funcion que comprobara si existe un usuario en el sistema
const comFindUserId = async(id: string, res: Response) => {
    //* |-> Retornamos una promesa que resolvera a el usuario que se busca por el id
    return new Promise(async(resolve, reject) => {
        //* |-> Buscamos el usuario por el id
        const user = await User.findById(id)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!user || user === null || user === undefined) {
            reject(false)
            return $Response(
                res,
                { succ: false, status: 404, msg: `${ _cloud_product_ === 'false' ? 'No se encontro el usuario por el id suministrado' : 'Lo sentimos, No se encontro el usuario por el id suminstrado' }` }
            )
        }
        resolve(user)
    })
}
/*********/
// TODO -> Exportacion de funciones
export {
    comFindUserId
}