/***********/
//*! Importaciones
    //* |-> { Request Response } -> express
    import { Request, Response } from 'express'
    //* |-> Nodemailer
    import mailer from 'nodemailer'
    //* |-> Google apis
    import { google } from 'googleapis'
    //* |-> Variables de entorno
    import { _google_client_, _goo_key_, _goo_key_api_, _redirect_api_goo_, _email_def_ } from '../environments/environments'
    //* |-> Interfaces
    import { _options_mail } from '../interface/interface.interface'
/***********/
//? -_ Servicio para el envio de correos
const sendEmails = async(res: Response, data_email: _options_mail) => {
    //* |-> Control de errores tryCatch
    try {
        //* |-> Creamos al configuracion del auth Google
        const auth2 = new google.auth.OAuth2(
            _google_client_,
            _goo_key_,
            _redirect_api_goo_
        )
        //* |-> Nos autenticamos en el proceso google
        await auth2.setCredentials({
            //* |-> Entregamos el token entregado por la validacion de la api GMAIL
            refresh_token: _goo_key_api_
        })
        //* |-> Obtenemos el token que nos proporciona google
        const acTo: any = await auth2.getAccessToken()
        //* |-> Configuramos el trasporte del emal
        const configTransport = await mailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: _email_def_,
                clientId: _google_client_,
                clientSecret: _goo_key_,
                refreshToken: _goo_key_api_,
                accessToken: acTo
            }
        })
        //* |-> Enviamos el email
        const send = await configTransport.sendMail(data_email)
        //* |-> Mostramos en consola la respuesta del envio
        console.log('Email enviado con exito', send);
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hizo la peticion un erro 500
        return res.status(500).json({
            success: false,
            msg: 'Ups... Ocurrio un error revisa los logs'
        })
    }
}
/***********/
// TODO -> Exportacion de funciones
export {
    sendEmails
}