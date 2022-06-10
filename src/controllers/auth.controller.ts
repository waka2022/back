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
    //* |-> Functions
    import { funAccount } from '../functions/solicitud.function'
/*********/
//? -_ Controlador que iniciara sesion
const signIn = async (req: Request, res: Response) => {
    //* |-> Capturamos los datos de la req
    const { email, password } = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el email en el sistema
        const findUserEmail = await User.findOne({ "email_t.email": email })
        //* |-> Si no existe retornaremos un error 404
        if (!findUserEmail || findUserEmail === null || findUserEmail === undefined) {
            return $Response(res, { status: 404, succ: false, msg: `${_cloud_product_ === 'false' ? 'No se encontro el usuario por el correo suministrado' : 'Lo sentimos, No son comparables los datos suministrados!'}` })
        }
        //* |-> Validamos que el usuario este verificado en el sistema
        if (!findUserEmail.email_t.verify_at) {
            //* |-> Si no eta verificado retornaremos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos, el usuario no esta verificado o activo en nuestro sistema.' }
            )
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
            succ: true, status: 200, msg: `Bienvenido ${findUserEmail.names}`, data: token
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
        const findUserEmail = await User.findOne({ "email_t.email": email })
        //* |-> Si no exite el usuario armaremos y guardamos
        if (!findUserEmail || findUserEmail === null || findUserEmail === undefined) {
            //* |-> Variable que contendra el cuerpo del nuevo usuario
            const body = {
                names: name,
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
            //* |-> Generaremos un token
            const token: string = await generateJWTexpire(new_user._id, '5h')
            //* |-> Retornamos un mensaje de exito 200
            return $Response(
                res,
                { status: 200, succ: true, msg: `Bienvenido ${new_user.names}`, data: token }
            )
        }else {
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
                { status: 200, succ: true, msg: `Bienvenido ${findUserEmail.names}`, data: token }
            )
        }
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
//? -_ Solicitar { verificacion, activacion, cambio }
const accountRequests = async(req: Request, res: Response) => {
    //* |-> Capturamos el email proveniente de la request
    const { email } = req.body
    //* |-> Capturamos la request que se pueden realizar para el envio de email
    const { request } = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscaremos si el email existe en el sistema
        const findUserEmail = await User.findOne({ "email_t.email": email })
        //* |-> Si no encuentra ningun documento relacionado
        if (!findUserEmail || findUserEmail === null || findUserEmail === undefined) {
            //* |-> Retornamos un error 404
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encontro ningun email en el sistema' : `Lo sentimos! El email ${email} no es comparable o no se encuentra en nuestro sistema de WAKA` }` }
            )
        }
        //* |-> Segun el request { 0: reactivacion, 1: verificacion, 2: cambio de contraseña } llamara a la funcion del envio de email
        await funAccount(findUserEmail, res, Number(request))
        //* |-> Respondemos al cliente un mensaje 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `Se envio correctamente tu solicitud para ${Number(request) === 0 ? 'la reactivacion de tu cuenta WAKA' : Number(request) === 1 ? 'la verificacion de tu cuenta' : Number(request) === 2 ? 'el cambio de contraseña' : ''}` }
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
    //* |-> Capturamos el usuario suministrado despues de la verificacion del usuario
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Actualizaremos el estado de verificacion en el sistema
        await User.findByIdAndUpdate(
            user_t._id,
            { 
                "email_t.verify_at.status": true,
                "email_t.verify_at.date": new Date()
            }
        )
        //* |-> Retornamos al cliente que hizo la peticion un mensaje de exito
        return $Response(
            res,
            { status: 200, succ: true, msg: `La verificacion de tu usuario a sido exitosa! Empieza a disfrutar la experiencia en WAKA.` }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Activacion de cuenta
const actAccount = async(req: Request, res: Response) => {
    //* |-> Capturamos el cuerpo del usuario por la request
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validaremos si el usuario esta deshabilitado
        if (user_t.status === true) {
            //* |-> Retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: 'Tu cuenta en este momento se encuentra activa por lo que no podemos activate de nuevo, sigue disfrutando de WAKA!' }
            )
        }
        //* |-> Activaremos la cuenta del usuario si esta desactivada
        await User.findByIdAndUpdate(user_t._id, { status: true })
        //* |-> Retornaremos al usuario que hace la peticion un mensaje de exito 200
        return $Response(
            res,
            { succ: true, status: 200, msg: 'Tu cuenta fue exitosamente activada! Es hora de disfrutar WAKA' }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Cambio de contraseña
const rePassAccount = async(req: Request, res: Response) => {
    //* |-> Capturamos el el usuario que intenta restablecer su contraseña
    const { user_t }: any = req
    //* |-> Capturamos las nuevas contraseñas
    const { new_pass, verify_pass } = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validamos que sean iguales las 2 contraseñas
        if (new_pass !== verify_pass) {
            //* |-> Si no son iguales retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Las contraseñas suministradas no son iguales' : `Lo sentimos, a lo mejor cuando nos pasaste la informacion de tus nuevas contraseñas no las pudimos comparar por ende te pedimos que lo vuelvas a intentar` }` }
            )
        }
        //* |-> Realizaremos el hash de la contraseña
        const genSalt = bcrypt.genSaltSync()
        const hashPass = bcrypt.hashSync(new_pass, genSalt)
        //* |-> Actualizaremos la contraseña en el modelo
        await User.findByIdAndUpdate(
            user_t._id,
            { password: hashPass }
        )
        //* |-> Retornamos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `${ _cloud_product_ === 'false' ? 'Se cambio correctamente la contraseña' : `El cambio de contraseña ha sido exitoso!` }` }
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
    signIn,
    signInGoogle,
    renewTokenAccount,
    verifiAtAccount,
    accountRequests,
    actAccount,
    rePassAccount
}