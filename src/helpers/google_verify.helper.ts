/***********/
//*! Importaciones
    //* |-> { OAuth2Client } - google-auth-library
    import { OAuth2Client } from 'google-auth-library'
    //* |-> Environments
    import { _google_client_ } from '../environments/environments'
import { _goo_user } from '../interface/interface.interface'
/***********/
//* |-> Definir cliente de google
const client_goo: OAuth2Client = new OAuth2Client(_google_client_)
/***********/
//* |-> Verificacion del token google
const gooVerifyToken = async(token: string): Promise<_goo_user> => {
    //* |-> Promesa que resolvera los datos de usuario
    return new Promise(async(resolve, reject) => {
        //* |-> Variable que almacenara el ticket de la verificacion del token
        const ticket = await client_goo.verifyIdToken({
            idToken: token,
            audience: _google_client_
        })
        //* |-> Cargamos el payload de la verificacion del usuario nuevo
        const pay: any = ticket.getPayload()
        //* |-> Extraemos los datos del usuario que registra o inicia sesion
        const { name, email, picture } = pay
        //* |-> Retornamos un objeto con la informacion verificada
        const user_goo: _goo_user = {
            name,
            email,
            picture
        }
        //* |-> Resolveremos el usuario de google
        resolve(user_goo)
        //* |-> Si falla retornaremos un false
        reject(false)
    })
}
/***********/
export {
    gooVerifyToken
}