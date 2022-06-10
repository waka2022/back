/***********/
//*! Importaciones
    //* |-> { Request && Response } - express
    import { Request, Response } from 'express'
    //* |-> Modelos
        //? -> Invoiced
        import Invoiced from "../models/invoiced.model";
        //? -> Booking
        import Booking from '../models/booking.model';
        //? -> Parking
        import Parking from '../models/parking.model';
    //* |-> Interfaces
    import { _request_reservation } from "../interface/interface.interface";
    //* |-> Services
    import { $Response } from '../services/resp.services'
    //* |-> Environments
    import { _cloud_product_, _key_files_, _url_socket_ } from '../environments/environments'
    //* |-> axios
    import axios from 'axios'
/***********/
//? -_ Controlador que mostrara la factura de una reserva en especifico
const viewAllInvoicedParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion (debe de ser el dueño del parqueadero)
    const { user_t }: any = req
    //* |-> Capturamos el id de la reserva
    const { id_booking }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos si la reserva tiene una factura
        const findInvoicedBookingId = await Invoiced.findOne({ id_booking })
        //* |-> Validamos que encuentre un documento relacionado
        if (!findInvoicedBookingId || findInvoicedBookingId === null || findInvoicedBookingId === undefined) {
            //* |-> Si no encuentra retornaremos un error 404
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, no se encontro ninguna factura relacionada a la reserva mencionada' }
            )
        }
        //* |-> Retornamos al cliente que hizo la peticion un mensaje de exito
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda de factura exitosa!', data: findInvoicedBookingId }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que mostrara una factura segun su id
const viewUniqueInvoiced = async(req: Request, res: Response) => {
    //* |-> Capturamos el id de la factura a buscar
    const { id_invoiced }: string | any = req.params
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos la factura por el id suministrado
        const findInvoicedId = await Invoiced.findById(id_invoiced).populate('id_booking')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findInvoicedId || findInvoicedId === null || findInvoicedId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, la factura a buscar no se encuentra en nuestro sistema waka'}
            )
        }
        //* |-> Respondemos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findInvoicedId }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que guardara la factura de la reservacion
const createInvoiced = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id de la reservacion a facturar
    const { id_booking }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validamos que el usuario que hace la peticion sea un parqueadero
        if (user_t.parking === false) {
            //* |-> Si no es un usuario parqueadero retornamos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos, no puedes generar la factura de esta reserva' }
            )
        }
        //* |-> Buscamos la reservacion por el id suministrado
        const findBookingId = await Booking.findById(id_booking).populate('id_park', 'price')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findBookingId || findBookingId === null || findBookingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, la reservacion a facturar no fue encontrada en nuestro sistema waka' }
            )
        }
        //* |-> Buscamos la reservacion por el id suministrado
        const findInvoicedBookingId = await Invoiced.findOne({ id_booking })
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (findInvoicedBookingId || findInvoicedBookingId != null || findInvoicedBookingId != undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, la reservacion a facturar ya tiene una factura abierta y en curso.' }
            )
        }
        //* |-> Extraemos ( status )
        const { status: { on_park, end_park }, id_park } = findBookingId
        //* |-> Validamos que el estado del fin de parqueo se haya terminado
        if (end_park.status !== true) {
            $Response(
                res,
                { status: 400, succ: false, msg: 'Lo sentimos, no se puede facturar esta reservacion' }
            )
        }
        //* |-> Calculamos las horas que el vehiculo se encontro estacionado
        const totalsHoursParking = await calculateTimeBooking(on_park.moment, end_park.moment)
        //* |-> Armamos el cuerpo que se almacenara
        const invoiced = {
            id_booking,
            totals: {
                hours: totalsHoursParking,
                price: totalsHoursParking > 0 ? totalsHoursParking * id_park.price : id_park.price
            }
        }
        //* |-> Añadimos el schema a la bd
        const new_invoiced = new Invoiced(invoiced)
        //* |-> Almacenamos al dbms
        new_invoiced.save()
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-invoiced`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-parking`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Respondemos al cliente un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Se ha creado la factura!' }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que actualizara y destacara si el pago fue ejecutado
const parnetInvoicedBookingId = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id de la reserva por los parametros del sistema
    const { id_booking }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validamos que el usuario sea un parqueadero
        if (user_t.parking === false) {
            //* |-> Si no es un parqueadero retornaremos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos, no puedes actualizar el pago de esta factura' }
            )
        }
        //* |-> Buscamos la reserva en la facturacion
        const findInvoicedBookingId = await Invoiced.findOne({ id_booking })
        console.log(findInvoicedBookingId);
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findInvoicedBookingId || findInvoicedBookingId === null || findInvoicedBookingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, no se encuentra la factura de la reserva suministrada' }
            )
        }
        //* |-> Actualizaremos el schema para registrar el pago de la factura
        await Invoiced.findByIdAndUpdate(findInvoicedBookingId._id, { parent: true })
        //* |-> Actualizamos el schema para registrar el pago en la factura
        await Booking.findByIdAndUpdate(id_booking, { "parnet.status_parnet": true, "parnet.totals": findInvoicedBookingId.totals.price })
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-invoiced`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-parking`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Retornaremos un mensaje de exito 200 al cliente que hizo la peticion
        return $Response(
            res,
            { status: 200, succ: true, msg: 'El estado de su factura ha cambiado y registrado el pago en efectivo' }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/***************Controladores no exportables***************/
//? -_ Controlador <Promise> que retornara el total de horas estando parqueado
const calculateTimeBooking = async(moment_park: string, moment_end_park: string): Promise<number> => {
    //* |-> Retornaremos una promesa que resolvera el total de horas segun la reservacion
    return new Promise((resolve, reject) => {
        //* |-> Formula que contendra la diferencia de tiempo
        let diffTime = (new Date(moment_end_park).getTime() - new Date(moment_park).getTime()) / 1000
        diffTime /= 3600
        //* |-> Redondeamos el tiempo que estuvo en el parqueadero para continuar con el total de tiempo
        const diffMap = Math.abs(Math.round(diffTime))
        resolve(diffMap)
    })
}
/***********/
// TODO -> Exportacion del modulo
export {
    calculateTimeBooking,
    createInvoiced,
    viewAllInvoicedParking,
    parnetInvoicedBookingId,
    viewUniqueInvoiced
}