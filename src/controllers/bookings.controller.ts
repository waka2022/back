/**********/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> Interfaces
    import { _request_reservation } from '../interface/interface.interface'
    //* |-> Servicios
    import { $Response } from '../services/resp.services'
    //* |-> Environments
    import { _cloud_product_, _key_files_, _url_socket_ } from '../environments/environments'
    //* |-> Models
    import Parking from '../models/parking.model'
    import Booking from '../models/booking.model'
    import Vehicle from '../models/vehicle.model'
    //* |-> Controllers
    import { calculateTimeBooking } from './invoiced.controller'
    //* |-> axios
    import axios from 'axios'
/**********/
//? -_ Controlador que mostrara todas las reservas que tiene un parqueadero
const viewAllBookings = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del parqueadero por los parametros request
    const { id_park } = req.params
    //* |-> Capturamos la peticion de la busqueda (historial || activas)
    const { h_r }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscaremos el parqueadero del usuario que hace la peticion
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Parqueadero no encontrado' : `Lo sentimos, el parqueadero no esta registrado en nuestro sistema` }` }
            )
        }
        //* |-> Validamos que el parqueadero sea del usuario que hace la peticion
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si no son iguales retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: 'No es posible continuar con la peticion' }
            )
        }
        //* |-> Buscaremos las reservas que tiene ese parqueadero
        const findBookingIdPark = await Booking.find({ 
            "id_park": id_park,
            "status.global_status": h_r === 'true' ? true : false
        })
        .populate('id_vehicle', 'type_vehi photo')
        .populate('id_user_res', 'names document phone img')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findBookingIdPark || findBookingIdPark === null || findBookingIdPark === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Parece que en este momento no tienes ninguna reserva!' }
            )
        }
        //* |-> Retornaremos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findBookingIdPark }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que mostrara una reserva segun su id
const viewUniqueBookingId = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id de la reserva a buscar
    const { id_booking }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos la reserva por el id suministrado
        const findBookingId = await Booking.findById(id_booking)
                                            .populate('id_user_res', 'names phone')
                                            .populate('id_vehicle', 'type_vehi.placa type_vehi.mark type_vehi.model')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findBookingId || findBookingId === null || findBookingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, la reserva buscada no existe o no fue encontrada en nuestro sistema waka' }
            )
        }
        //* |-> Retornaremos un mensaje de exito al cliente que hizo la peticion 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findBookingId }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que mostrara las reservas de un usuario
const viewAllBookingsUser = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hizo la peticion
    const { user_t }: any = req
    //* |-> Capturamos la peticion de la busqueda (historial || activas)
    const { h_r }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos las reservaciones de hechas por un usuario
        const findBookingUser = await Booking.find({ 
            "id_user_res": user_t._id,
            "status.global_status": h_r === 'true' ? true : false
        })
        .populate('id_vehicle')
        .populate('id_park')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findBookingUser || findBookingUser === null || findBookingUser === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'EN este momento no tienes ninguna reservacion hecha, pendiente o en curso.' }
            )
        }
        //* |-> Retornamos al cliente que hizo la peticion un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findBookingUser }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })        
    }
}
//? -_ Controlador que creara una reserva
const createBooking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que va hacer la reserva en un parqueadero (user: BP)
    const { user_t }: any = req
    //* |-> Capturamos el cuerpo que contendra la informacion que almacenaremos
    const body_boo: _request_reservation = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validaremos que el usuario que hace la peticion de reserva sea un BP
        if (user_t.parking === true) {
            //* |-> Si es un parqueadero retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'El usuario no puede reservar' : 'Lo sentimos, no puedes solicitar una reserva' }` }
            )
        }
        //* |-> Buscaremos si el parqueadero existe por el id suministrado en el body request
        const findParkingId = await Parking.findById(body_boo.id_park)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Parqueadero no encontrado' : `Lo sentimos, el parqueadero a donde te diriges no lo encontramos en nuestro sistema` }` }
            )
        }
        //* |-> Buscaremos el vehiculo existe en el sistema
        const findVehicleId = await Vehicle.findById(body_boo.id_vehicle)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findVehicleId || findVehicleId === null || findVehicleId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Vehiculo no encontrado' : `Lo sentimos, el vehiculo no lo encontramos registrado en waka` }` }
            )
        }
        //* |-> Validamos que el vehiculo sea del usuario que hace la peticion
        if (String(user_t._id) !== String(findVehicleId.id_user)) {
            //* |-> Si es diferente retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'El vehiculo no es del usuario' : 'Lo sentimos, no eres elpropietario del vehiculo que quiere parquear' }` }
            )
        }
        //* |-> Validamos que todavia se encuentre disponible y con cupos
        if (findParkingId.availability === false || findParkingId.quotas.totals == findParkingId.quotas.not_available) {
            //* |-> Si el parqueadero no esta disponible o no tiene cupos retornaremos un error 400 y actualizaremos el modelo del parqueadero en caso de que no se haya hecho
            await Parking.findByIdAndUpdate(findParkingId._id, { availability: false })
            //* |-> Retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Parqueadero no disponible' : `Lo sentimos, el parqueadero selecionado no se encuentra disponible en este momento` }` }
            )
        }
        //* |-> Armaremos el cuerpo para almacenarlo
        const booking: _request_reservation = {
            ...body_boo,
            id_user_res: user_t._id,
            date_booking: {
                publish: new Date().toISOString()
            },
            status: {
                on_route: true
            },
            parnet: {
                status_parnet: false
            }
        }
        //* |-> Lo setteamos en la clase
        const new_booking = new Booking(booking)
        //* |-> Almacenaremos
        new_booking.save()
        //* |-> Actualizaremos los cupos del parqueadero no disponibles
        await Parking.findByIdAndUpdate(findParkingId._id, { "quotas.not_available": findParkingId.quotas.not_available + 1 })
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-booking`,
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
        //* |-> Respondemos al cliente un mensaje de exito
        return $Response(
            res,
            { status: 200, succ: true, msg: `${ _cloud_product_ === 'false' ? 'Reserva hecha' : `Tu reserva se ha agregado con exito! Te estan esperando para que guardes tu vehiculo.` }` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que cambiara el estado de la reserva
const changeStatusBooking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id de la reserva a actualizar y el trayecto
    const { id_booking, journey }: string | any = req.params //? -> journey: { 0: on_site, 1: on_park, 2: end_park }
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos la reservacion por el id suministrado
        const findBookingId = await Booking.findById(id_booking).populate('id_park')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findBookingId || findBookingId === null || findBookingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, la reserva no existe o no fue encontrada en nuestro sistema de waka' }
            )
        }
        /*
        //* |-> Validamos que el usuario que cambia el estado de la reserva sea el mismo que la solicito
        if (String(user_t._id) !== String(findBookingId.id_user_res)) {
            //* |-> Si son diferentes retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se pueden actualizar los datos, no es el usuario que hizo la reservacion' : `Lo sentimos, no puedes actualizar el estado de esta reserva ya que no eres el que la solicito.` }` }
            )
        }
        */
        //* |-> Validaremos si la reserva esta en un estado 1 o 2
        if (findBookingId.status.end_park.status === true || findBookingId.status.on_cancel === true) {
            //* |-> Si esta en alguno de los estados sin retorno, retornaremos un error 400 ya que no se podra revertir una reserva en un estado final
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'En estado final si posibilidad de actualizar' : `Lo sentimos, la reserva en este momento se encuentra en estado el cual no se puede editar o actualizar... su estado actual es ${findBookingId.status.on_park.status === true ? 'Parqueado' : findBookingId.status.end_park.status === true ? 'Fin de parqueo' : findBookingId.status.on_cancel === true ? 'Cancelado' : ''}` }` }
            )
        }
        //* |-> Dependiendo el trayecto se actualizara el modelo de la reserva
        switch (Number(journey)) {
            case 0: //? -> En sitio
                //* |-> Actualizamos la fecha en la que el vehiculo se encuentra en sitio y cambia los estados de "en ruta" a false y "en sitio" a true
                    await Booking.findByIdAndUpdate(
                        id_booking, 
                        { 
                            "date_booking.booking": new Date(), 
                            "status.on_route": false, 
                            "status.on_site": true ,
                            "status.on_park.status": false,
                            "status.end_park.status": false,
                            "status.on_cancel": false,
                        }
                    )
                break;
            case 1: //? -> Estacionado
                //* |-> Actualizamos el momento en el que el vehiculo esta estacionado { capturamos el momento para iniciar a facturar y activamos el estado del estacionamiento }
                    await Booking.findByIdAndUpdate(
                        id_booking,
                        {
                            "status.on_route": false,
                            "status.on_site": false,
                            "status.on_park.moment": new Date().toISOString(),
                            "status.on_park.status": true,
                            "status.end_park.status": false,
                            "status.on_cancel": false,
                        }
                    )
                break;
            case 2: //? -> Fin del parqueo
                //* |-> Actualizamos el momento en el que el vehiculo se retira del parqueadero { capturamos el momento final para facturar y activaremos el estado de fin de parqueo }
                await Booking.findByIdAndUpdate(
                    id_booking,
                    {
                        "status.on_route": false,
                        "status.on_site": false,
                        "status.on_park.status": false,
                        "status.end_park.moment": new Date().toISOString(),
                        "status.end_park.status": true,
                        "status.on_cancel": false,
                        "status.global_status": false,
                    }
                )
                //* |-> Actualizamos los cupos desponibles del parqueadero y restamos 1 por el que termino
                await Parking.findByIdAndUpdate(
                    findBookingId.id_park._id,
                    { "quotas.not_available": findBookingId.id_park.quotas.not_available - 1 }
                )
                break;
            case 3: //? -> Cancelado
                //* |-> Actualizamos todos los estados a falso y el unico activo sera el de cancelado
                await Booking.findByIdAndUpdate(
                    id_booking,
                    {
                        "status.on_route": false,
                        "status.on_site": false,
                        "status.on_park.status": false,
                        "status.end_park.status": false,
                        "status.on_cancel": true,
                        "status.global_status": false,
                    }
                )
                //* |-> Actualizamos los cupos desponibles del parqueadero y restamos 1 por el que termino
                await Parking.findByIdAndUpdate(
                    findBookingId.id_park._id,
                    { "quotas.not_available": findBookingId.id_park.quotas.not_available - 1 }
                )
            break;
            default:
                break;
        }
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-booking`,
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
        //* |-> Retornaremos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Se ha actualizado correctamente el estado de tu reservacion!' }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que devolvera el tiempo que el vehiculo lleva estacionado
const viewTimeParkedVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id de la reservacion por los parametros de la request
    const { id_booking }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos la reservacion por el id suministrado
        const findBookingId = await Booking.findById(id_booking)
        //* |-> Si no encuentra algun documento relacionado retornaremos un error 404
        if (!findBookingId || findBookingId === null || findBookingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encuentra la reservacion' : `Lo sentimos, no se encuentra la reservacion buscada por los datos suministrados` }` }
            )
        }
        //* |-> Validamos que el vehiculo se encuentre estacionado en la reservacion planteada
        if (!findBookingId.status.on_park) {
            //* |-> Si no ha llegado a este estado retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: 'Lo sentimos, el vehiculo actualmente no se encuentra estacionado en la reservacion escogida' }
            )
        }
        //* |-> Validamos que la reserva no se encuentre en algun estado fina ( cancelado || final de parqueo )
        if (findBookingId.status.end_park.status === true || findBookingId.status.on_cancel === true) {
            //* |-> Si esta en algun estado final retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Reservacion en estado final, sin posibilidad de mostrar el tiempo' : 'Lo sentimos, la reservacion del estacionamiento ya caduco.' }` }
            )
        }
        //* |-> Extraemos las fecha del vehiculo estacionado
        const { status:{ on_park:{ moment } } } = findBookingId
        //* |-> Calculamos el tiempo que el vehiculo se encuentra estacionado
        const timeStatic = await calculateTimeBooking(moment, new Date().toISOString())
        //* |-> Devolveremos el tiempo que el vehiculo lleva estacionado junto un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `Tiempo que lleva estacionado el vehiculo: ${timeStatic}h`, data: timeStatic }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que cargara las fotos de alguna novedad de un vehiculo
const uploadNewsVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que va a añadir las novedades del vehiculo
    const { user_t }: any = req
    //* |-> Capturamos el id de la reservacion
    const { id_booking }: string | any = req.params
    //* |-> Capturamos las urls suministradas por waka files para el control de los archivos
    const { urls } = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos la reserva por el id suministrado
        const findBookingId = await Booking.findById(id_booking)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findBookingId || findBookingId === null || findBookingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos, la reserva que se intenta buscar no existe o no es comparable en el sistema de waka.' }
            )
        }
        //* |-> Validamos que el usuario sea un parqueadero
        if (user_t.parking !== true) {
            //* |-> Si es diferente a un parqueadero retornaremos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos, solo el parqueadero puede subir novedade de un vehiculo con reserva' }
            )
        }
        //* |-> Actualizaremos el modelo de las fotos cargadas con la url de proporcionadas por waka files
        await Booking.findByIdAndUpdate(id_booking, { photo_news: urls })
        //* |-> Respondemos al cliente que hace la peticion un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Se ha añadido correctamente las fotos de novedades' }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/**********/
// TODO -> Exportacion del modulo
export {
    createBooking,
    viewAllBookings,
    viewUniqueBookingId,
    changeStatusBooking,
    viewTimeParkedVehicle,
    uploadNewsVehicle,
    viewAllBookingsUser
}