/*********/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> Bcrypt
    import bcrypt from 'bcrypt'
    //* |-> Servicio para la respuesta de servicios http
    import { $Response } from '../services/resp.services';
    //* |-> Modelo de usuarios
    import User from '../models/user.model'
    //* |-> Environments
    import { _cloud_product_ } from '../environments/environments'
    //* |-> { Generar token } - Helpers
    import { generateJWTexpire } from '../helpers/jwt.helper'
    //* |-> Helper google verify
    import { gooVerifyToken } from '../helpers/google_verify.helper'
/*********/
//? -_ Controlador que iniciara sesion
const signIn = async (req: Request, res: Response) => {
    //* |-> Capturamos los datos de la req
    const { email, password } = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el email en el sistema
        const findUserEmail = await User.findOne({ email })
        //* |-> Si no existe retornaremos un error 404
        if (!findUserEmail || findUserEmail === null || findUserEmail === undefined) {
            return $Response(res, { status: 404, succ: false, msg: `${_cloud_product_ === 'false' ? 'No se encontro el usuario por el correo suministrado' : 'Lo sentimos, No son comparables los datos suministrados!'}` })
        }
        //* |-> Comparamos la contraseña del usuario
        const validPassUser = bcrypt.compareSync(password, findUserEmail.password)
        //* |-> Si las contraseñas no son comparables
        if (!validPassUser) {
            //* |-> Retornamos un error 400
            return $Response(res, { status: 400, succ: false, msg: `${_cloud_product_ === 'false' ? 'No se encontro el usuario por el correo suministrado' : 'Lo sentimos, No son comparables los datos suministrados!'}` })
        }
        //* |-> Generamos el token
        const token: string = await generateJWTexpire(findUserEmail._id, '5h')
        //* |-> Respondemos al cliente un mensaje de exito
        return $Response(res, {
            succ: true, status: 200, msg: `Bienvenido ${findUserEmail.names.name}`, data: token
        })
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que iniciara sesion con google
const signInGoogle = async (req: Request, res: Response) => {
    //* |-> Capturamos el token de google
    const { token_google } = req.body
    //* |-> Control de errores TryCatch
    try {
        //* |-> Extraemos la informacion del token de google
        const { email, name, picture } = await gooVerifyToken(token_google)
        //* |-> Buscamos si exite el usuario previamente en el sistema
        const findUserEmail = await User.findOne({ email })
        //* |-> Si no exite el usuario armaremos y guardamos
        if (!findUserEmail || findUserEmail === null || findUserEmail === undefined) {
            //* |-> Variable que contendra el cuerpo del nuevo usuario
            const body = {
                names: {
                    name: name,
                    last_name: ''
                },
                email_t: {
                    email
                },
                password: '@@@@@@',
                google: true,
                img: picture
            }
            //* |-> Agregaremos el modelo nuevo al shcema de usuarios
            const new_user = new User(body)
            //* |-> Guardamos el nuevo modelo
            new_user.save()
        }
        //* |-> Validamos si esta habilitado en google
        if (findUserEmail.google !== true) {
            //* |-> Si es diferente retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No es usuario de google' : `Lo sentimos el usuario no esta habilitado para ingresos con google` }` }
            )
        }
        //* |-> Generaremos un token
        const token: string = await generateJWTexpire(findUserEmail._id, '5h')
        //* |-> Retornamos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `Bienvenido ${findUserEmail.names.name}`, data: token }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Ronavar el token
const renewTokenAccount = async (req: Request, res: Response) => {
    //* |-> Capturmos el token por los parametros de la request
    const { tok }: string | any = req.params
    //* |-> Capturamos el usuario
    const { user_t, token }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validaremos que los token sea iguales
        if (tok !== token) {
            //* |-> Si las contraseña no es igual retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${_cloud_product_ === 'false' ? 'Los token no son iguales' : `Lo sentimos pero no podemos renovar tu informacion en este momento...`}` }
            )
        }
        //* |-> Generaremos un nuevo token
        const newToken: string = await generateJWTexpire(user_t._id, '5h')
        //* |-> Retornaremos un mesaje de exito al cliente que hizo la peticion 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Renovacion exitosa!', data: newToken }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Verificar usuario
const verifiAtAccount = async (req: Request, res: Response) => {

}
//*? -_ controlador que inhabilitar usuarios
const disableUserAcount = async (req: Request, res: Response) => {

}
/*********/
// TODO -> Exportacion del modulo
export {
    signIn,
    signInGoogle,
    renewTokenAccount,
    verifiAtAccount,
    disableUserAcount
}