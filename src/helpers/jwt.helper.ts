/*********/
//*! Importaciones
    //* |-> jsonwebtoken
    import jwt from 'jsonwebtoken'
    //* |-> Environments
    import { _secret_token_ } from '../environments/environments'
/*********/
//? -_ Helper que generara un token de forma asincrono
const generateJWTexpire = async(id: string, h_exp: string): Promise<string> => {
    //* |-> Retornamos una promesa que resolvera el token
    return new Promise((resolve, reject) => {
        //* |-> Armamos el payload que almacenara el token
        const pay = {
            id
        }
        //* |-> Generaremos el token
        jwt.sign(pay, _secret_token_, { 'expiresIn': h_exp }, (err, token) => {
            if(err) return reject(`No se pudo generar el token (${err})`)
            return resolve(String(token))
        })
    })
}
/*********/
// TODO -> Exportacion del modulo
export {
    generateJWTexpire
}