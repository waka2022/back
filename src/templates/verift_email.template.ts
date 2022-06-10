/////////////
//*! Importaciones
    //* |-> Variables de entorno
    import { _urls_template_ } from '../environments/environments'
/////////////
//? -_ Template para el envio del token empresarial
export const email_account_template_html = (name_user: string, text: string, token: string, img: string) => {
    //* -> Armar el template
    const template: string = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
        <style>
        table, td, div, h1, p {font-family: Arial, sans-serif;}
        </style>
    </head>
    <body style="margin:0;padding:0;">
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
            <tr>
                <td align="center" style="padding:0;">
                    <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                        <tr>
                            <td align="center">
                                <div style="padding:40px 0 30px 0; background-image: url(${img}); background-size: 100% 100%;clip-path: polygon(0 0, 100% 0%, 80% 100%, 20% 100%);min-height: 300px;">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:36px 30px 42px 30px;">
                                <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                <tr>
                                    <td style="padding:0 0 36px 0;color:#153643;">
                                        <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">
                                            Hola ${name_user}!
                                        </h1>
                                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                            ${text}.
                                        </p>
                                        <a href="${_urls_template_}re-activation-account/${token}">Iniciemos ahora!</a>
                                    </td>
                                </tr>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
    return template
}