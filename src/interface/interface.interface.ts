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
    names?: string;
    document?: string;
    phone?: string;
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
//? $ Interface para la creacion de vehiculos
interface _vehicle_create {
    id_user?: string;
    type_vehi: {
        global: number; //? Tipo de vehiculo { 0: Moto, 1: Carro, 2: Bici }
        mark: string;
        model: string;
        placa: string;
        color: string;
    },
    photo?: string;
}
//? $ Interface para la creacion de parqueaderos
interface _parking_create {
    id_user?: string;
    address: string;
    type_parks: string[];
    type_security: _security_parking;
    availability: boolean;
    descript: string;
    ubi?: {
        lon: number;
        lat: number;
    };
    price: number;
    quotas: {
        totals: number;
        not_available: number;
    };
    photo?: string[];
}
//? $ Interface para la seguridad
interface _security_parking {
    cams: boolean;
    vigilant: boolean;
    add?: _add_security[]
}
//? $ Interface para la add de security
interface _add_security {
    type: string;
    have: boolean
}
//? $ Interface para los ratings del parqueadero
interface _rating_parking {
    id_user?: string;
    id_parking: string;
    coment: string;
    ranking: number
}
//? $ Interface para la solicitud de reservas
interface _request_reservation {
    _id?: string;
    id_user_res?: string;
    id_vehicle: string;
    id_park: string;
    date_booking: {
        publish: string;
        booking?: string;
    };
    status: {
        on_route: boolean;
        on_site?: boolean;
        on_park?: {
            moment?: string;
            status?: boolean;
        };
        end_park?: {
            moment?: string;
            status?: boolean;
        };
    };
    parnet: {
        totals?: number;
        status_parnet: boolean;
    }
}
//? $ Interface para el registro del ranking
interface _ranking_register {
    id_parking: string;
    coment: string;
    ranking: number;
}
//? $ interface para las graficas
interface _values_graff {
    name: string;
    value: number;
}
/*********/
// TODO -> Exportacion de interfaces
export {
    _resp,
    _goo_user,
    _add_info,
    _update_user,
    _options_mail,
    _vehicle_create,
    _parking_create,
    _rating_parking,
    _request_reservation,
    _ranking_register,
    _values_graff
}