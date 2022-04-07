/*********/
//*! Importaciones
    //* |-> jsonwebtoken
    import jwt from 'jsonwebtoken'
    //* |-> Environments
    import { _secret_token_, _key_files_, _secret_token_files_ } from '../environments/environments'
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
//? -_ Helper que generara el token para la conexion entre waka y waka_files
const generateJWTwakaFilesConnection = async(): Promise<string> => {
    //* |-> Retornamos una promesa que resolvera un string (token)
    return new Promise((resolve, reject) => {
        //* |-> Construimos el payload del token
        const payload: { secrect: string } = {
            secrect: _key_files_
        }
        //* |-> Generamos el token por un tiempo de exoiracion de 5m
        jwt.sign(
            payload,
            _secret_token_files_,
            { expiresIn: '300s' },
            (err, token) => {
                if(err) return reject('No es posible generar una autentificacion punto a punto con waka')
                return resolve(String(token))
            }
        )
    })
}
//? -_ Helper que generara el token para la conexion entre waka y waka_files
const generateJWTwakaFilesInfo = async(info: {id_user: string, type: number, id_vehicle?: string, id_parking?: string}): Promise<string> => {
    //* |-> Retornamos una promesa que resolvera un string (token)
    return new Promise((resolve, reject) => {
        //* |-> Construimos el payload del token
        const payload: { id_user: string, id_vehicle?: string, id_parking?: string, type: number } = {
            id_user: info.id_user,
            id_parking: info.id_parking,
            id_vehicle: info.id_vehicle,
            type: info.type
        }
        //* |-> Generamos el token por un tiempo de exoiracion de 5m
        jwt.sign(
            payload,
            _secret_token_files_,
            { expiresIn: '300s' },
            (err, token) => {
                if(err) return reject('No es posible generar una autentificacion punto a punto con waka')
                return resolve(String(token))
            }
        )
    })
}
/*********/
// TODO -> Exportacion del modulo
export {
    generateJWTexpire,
    generateJWTwakaFilesConnection,
    generateJWTwakaFilesInfo
}