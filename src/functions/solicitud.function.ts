/***********/
//*! Importaciones
    //* |-> { Response } - express
    import { Response } from 'express'
    //* |-> Helpers
    import { generateJWTexpire } from '../helpers/jwt.helper'
    //* |-> Templates
    import { email_account_template_html } from '../templates/verift_email.template'
    //* |-> Service
    import { sendEmails } from '../services/mailer.services'
    //* |-> Interface
    import { _options_mail } from '../interface/interface.interface'
    //* |-> Environments
    import { _email_def_ } from '../environments/environments'
/***********/
//? -_ Funcion para la solicitud de reactivacion de cuenta
const funAccount = async(user: any, res: Response, request: number) => {
    //* |-> control de errores TryCatch
    try {
        //* |-> Generaremos un toquen provicional de 2h max
        const token_reactivation = await generateJWTexpire(user._id, '2h')
        //* |-> Generaremos el template
        const template = email_account_template_html(
            user.names, 
            `${ 
                request === 0 
                ? `Nos satisface que vuelvas a WAKA! Por ello hemos preparado un enlace para que lo puedas hacer, bienvenido de vuelta ${user.names.name}`
                : request === 1 
                ? `Queremos que tu experiencia en WAKA sea unica, por lo que para mejorar tu experiencia y la de los demas usuarios necesitamos verificar tu identidad. Te invitamos a que verifiques tu email ${user.names.name}`
                : request === 2
                ? `Hemos recibido la solicitud para el cambio de contraseña, para mejorar tu experiencia puedes acceder al siguiente vinculo!`
                : ''
            }`,
            token_reactivation,
            `${
                request === 0
                ? 'https://cdn.pixabay.com/photo/2016/11/23/17/24/woman-1853936_960_720.jpg'
                : request === 1
                ? 'https://cdn.pixabay.com/photo/2016/11/22/20/10/dog-1850465__340.jpg'
                : request === 2
                ? 'https://cdn.pixabay.com/photo/2014/06/04/16/36/man-362150__340.jpg'
                : ''
            }`
        )
        //* |-> Armamos el cuerpo del email
        const send_email: _options_mail = {
            from: _email_def_,
            to: user.email_t.email,
            subject: `
            ${
                request === 0
                ? 'WAKA | Reactivacion de cuenta!'
                : request === 1
                ? 'WAKA | Verificacion de email!'
                : request === 2
                ? 'WAKA | Cambio de contraseña!'
                : ''
            }
            `,
            html: template
        }
        //* |-> Enviaremos el email
        await sendEmails(res, send_email)
    } catch (err) {
        //*! Imprimimos el error
        console.log(err);
        //*! Retornamos un nuevo error
        throw new Error("Ocurrio un problema al momento de generar la solicitud para la reactivacion de la cuenta");
    }
}
//? -_ Funcion para la solicitud de cambio de contraseña
/**
 * 
 */
/***********/
// TODO -> Exportamos las funciones creadas
export {
    funAccount
}