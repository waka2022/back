/*********/
//*! Importaciones
    //* |-> Core { Request, response } - express
    import { Request, Response } from "express";
    //* |-> Bcrypt
    import bcrypt from 'bcrypt'
    //* |-> Modulos
    //? -> Users
    import Users from '../models/user.model'
    //* |-> Servicios
        //? -> Response
        import { $Response } from '../services/resp.services'
        //? -> Email
        import { sendEmails } from '../services/mailer.services'
    //* |-> Environments
    import { _cloud_product_, _email_def_ } from '../environments/environments'
    //* |-> Interface
    import { _add_info, _update_user } from "../interface/interface.interface";
    //* |-> Templates
        //? -> Disable account
        import { email_disable_template_html } from '../templates/disable_account.template'
/*********/
//*? -_ Controlador  que mostrara todos los usuarios inscritos en el sistema waka
const viewAllUser = async (req: Request, res: Response) => {
    //* |-> 
}
//*? -_ Controlador que mostrara un usuario segun su id
const viewUserId = async (req: Request, res: Response) => {
    //* |-> Capturamos el id del usuario que se va a buscar
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos al ppusuario por el id suministrado
        const findUserId = await Users.findById(user_t._id)
        //* |-> Si no encuentra ningun documento relacionado a la busqueda retornaremos un error 404
        if (!findUserId || findUserId === null || findUserId === undefined) {
            return $Response(res, { status: 404, succ: false, msg: `${_cloud_product_ === 'false' ? 'No se encontro el usuario por el id suministrado' : 'Lo sentimos, No se encontro el usuario por el id suminstrado'}` })
        }
        //* |-> Si encuentra un documento relacionado retornaremos un mensaje de exito 200 junto con la data
        return $Response(res, { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findUserId })
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//*? -_ Controlador que creara los usuarios
const registerUser = async (req: Request, res: Response) => {
    //* |-> Capturamos el cuerpo de la peticion
    const body = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Desestructuramos las propiedades nesesarias
        const { password, email } = body
        //* |-> Buscamos si el correo suministrado existe previamente en el sistema para evitar duplas
        const findUserEmail = await Users.findOne({ email })
        //* |-> Si encuentra un documento relacionado retornaremos un error 400
        if (findUserEmail || findUserEmail != null || findUserEmail != undefined) {
            return $Response(res, { status: 400, succ: false, msg: _cloud_product_ === 'false' ? 'El usuario ya existe en el sistema' : 'Lo sentimos, en este momento el correo suministrado ya existe en el sistema' })
        }
        //* |-> Capturamos el salto del hash pass
        const saltHash = bcrypt.genSaltSync()
        //* |-> Realizamos el hash
        const pass_encript = bcrypt.hashSync(password, saltHash)
        //* |-> Incorporamos la contraseña encriptada en el modelo del usuario que se va a crear
        const new_body = {
            names: {
                name: body.name,
                last_name: body.last_name
            },
            email_t: {
                email
            },
            password: pass_encript
        }
        //* |-> Armamos el cuerpo de el usuario
        const new_user = new Users(new_body)
        //* |-> Guardamos el nuevo usuario en el dbms
        new_user.save()
        //* |-> Respondemos al cliente que hizo la peticion un mensaje de exito 200
        return $Response(res, { status: 200, succ: true, msg: _cloud_product_ === 'false' ? 'Se creo correctamente el usuario' : `Se ha creado correctamente un nuevo usuario con correo ${email}, pide la verificacion y inicia ahora` })
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//*? -_ Controlador que añadira la informacion adicional para completar el perfil
const addInfoUser = async (req: Request, res: Response) => {
    //* |-> Capturamos el cuerpo de la peticion
    const { document, phone, parking } = req.body
    //* |-> Capturamos la informacion proveniente del token
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Armamos el cuerpo de la informacion adicional para el usuario
        const add_info: _add_info = {
            document,
            phone,
            parking,
            role: parking === true ? 'USER_PP' : 'USER_BP'
        }
        //* |-> Actualizamos el modelo del usuario
        const new_user_info = await Users.findByIdAndUpdate(user_t._id, add_info, { new: true })
        //* |-> Retornamos al cliente que hizo la peticion un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `${_cloud_product_ === 'false' ? 'Se añadio correctamente la informacion adicional del usuario' : `Se a añadido la informacion adicional de tu perfil correctamente, Bienvenido a WAKA ${user_t.names.name}`}`, data: new_user_info }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }

}
//*? -_ Controlador que actualizara datos del usuario
const updateInfoUser = async (req: Request, res: Response) => {
    //* |-> Capturamos el usuario suministrado por la validacion token
    const { user_t }: any = req
    //* |-> Capturamos los datos que actualizara
    const body: _update_user = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscaremos si exite un documento parecido en el sistema
        const findUsersDocument = await Users.findOne({ document: body.document })
        //* |-> Si existe un usuario con el mismo documento retornamos un error 400
        if (findUsersDocument || findUsersDocument != null || findUsersDocument != undefined) {
            return $Response(
                res,
                { succ: false, status: 400, msg: `${_cloud_product_ === 'false' ? 'Hay un documento igual en el sistema' : `Lo sentimos pero el documento inscrito previamente ya existe o aparece en otro susuario`}` }
            )
        }
        //* |-> Buscaremos si exite un documento parecido en el sistema
        const findUsersPhone = await Users.findOne({ phone: body.phone })
        //* |-> Si existe un usuario con el mismo documento retornamos un error 400
        if (findUsersPhone || findUsersPhone != null || findUsersPhone != undefined) {
            return $Response(
                res,
                { succ: false, status: 400, msg: `${_cloud_product_ === 'false' ? 'Hay un telefono igual en el sistema' : `Lo sentimos pero el telefono inscrito previamente ya existe o aparece en otro susuario`}` }
            )
        }
        //* |-> Actualizaremos la informacion del usuario
        await Users.findByIdAndUpdate(user_t._id, body)
        //* |-> Respondemos al cliente que hizo la peticion un mensaje de exito 200
        return $Response(
            res,
            { succ: true, status: 200, msg: `${_cloud_product_ === 'false' ? 'Se actualizo la informacion correctamente' : `Felicidades! Se ha actualizado correctamente la informacion de tu usuario`}` }
        )
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//*? -_ Controlador que cerrar temporarmente una cuenta
const disableAccount = async (req: Request, res: Response) => {
    //* |-> Capturamos el usuario que quiere inhabiliar su cuenta
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Construimos el template de inhabilitacion de cuenta
        const inhaTemp: string = email_disable_template_html(user_t.names.name)
        //* |-> Enviaremos un correo de inhabilitacion
        sendEmails(res, { from: _email_def_, to: user_t.email_t.email, subject: 'Inhabilitacion de cuenta', html: inhaTemp })
        //* |-> Actualizaremos el schema del usuario para inhabiliarlo del sistema
        await Users.findByIdAndUpdate(user_t._id, { status: false })
        //* |-> Responderemos al cliente que hizo la peticion un mensaje de exito 200
        return $Response(
            res,
            { succ: true, status: 200, msg: `${_cloud_product_ === 'false' ? 'Se ha inhabilitado correctamente el usuario' : `Se ha inhabilitado correctamente tu cuenta! Esta se eliminara en 15 dias, si deseas volver a tenerla puedes solicitar una reactivacion.`}` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/*********/
// TODO -> Exportacion del modulo
export {
    registerUser,
    viewAllUser,
    viewUserId,
    addInfoUser,
    updateInfoUser,
    disableAccount
}