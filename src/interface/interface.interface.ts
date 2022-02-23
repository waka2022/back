/*********/
//? -_ Definicion de interfaces
/*********/
//? -> Interface para la respuesta del servidor
interface _resp {
    status: number,
    succ: boolean,
    msg: string,
    data?: any
}
//? -> Interface de la informacion del usuario google
interface _goo_user {
    name: string,
    email: string,
    picture: string
}
//? -> Interface para añadir informacion del usuario previamente registrado
interface _add_info {
    document: string;
    phone: string;
    parking: boolean;
    role: string;
}
//? -> Interface para la actualizacion de datos del usuario
interface _update_user {
    names: {
        name?: string;
        last_name?: string;
    },
    document: string;
    phone: string;
}
//? $ interface de configuracion mailer
interface _options_mail {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string
    attachments?: any[]
}
/*********/
// TODO -> Exportacion de interfaces
export {
    _resp,
    _goo_user,
    _add_info,
    _update_user,
    _options_mail
}