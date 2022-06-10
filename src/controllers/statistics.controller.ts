/*************/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> { Response } - services
    import { $Response } from '../services/resp.services'
    //* |-> Environments
    import { _cloud_product_ } from '../environments/environments'
    //* |-> Parking schema
    import Parking from '../models/parking.model'
    //* |-> Booking schema
    import Booking from '../models/booking.model'
    //* |-> Interfaces
    import { _values_graff } from '../interface/interface.interface'
/*************/
//? -_ Controlador que traera las estadisticas de todos los tipos de vehiculos estacionados en el parqueadero
const statisticTypeVehiParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos las fechas a buscar
    const { start_date, end_date, id_park, filters } = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parqueadero al que se le sacara la estadistica
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no encuentra ningun resultado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(res, {
                status: 404,
                succ: false,
                msg: 'No se encuentra el parqueadero seleccionado en nuestro sistema'
            })
        }
        //* |-> Validamos que el parqueadero corresponda al usuario que hace la busqueda
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si el usuario no corresponde al que hace la busqueda retornaremos un error 401
            return $Response(res, {
                status: 401,
                succ: false,
                msg: 'Lo sentimos, No se puede consultar los datos de este parqueadero'
            })
        }
        //* |-> Validamos que el usuario sea un parqueadero
        if (user_t.parking === false) {
            //* |-> Retornaremos un error 401
            return $Response(res, {
                status: 401,
                succ: false,
                msg: 'Lo sentimos, los datos que intenta buscar no pueden ser suministrados'
            })
        }
        //* |-> Realizamos la busqueda para traer todas las reservas de un parqueadero completadas o facturadas
        const findBookingRangeDateAndFinish = await Booking.find(
            {
                $and: [
                    {
                        "date_booking.publish": {
                            $gte: new Date(start_date).toISOString(),
                            $lt: new Date(end_date).toISOString()
                        },
                        "parnet.status_parnet": filters === 'true' ? true : false,
                        "id_park": findParkingId._id
                    }
                ]
            }
        ).populate('id_vehicle')
        //* |-> Variable que almacenara los datos estadisticos segun el tipo del parqueadero
        const arrStatistic: _values_graff[] = []
        //* |-> Filtraremos las reservas completadas por el tipo de vehiculo
        const filterMoto = findBookingRangeDateAndFinish.filter(
            (elt) => elt.id_vehicle.type_vehi.global === 0
        )
        //* |-> Filtraremos las reservas completadas por el tipo de vehiculo
        const filterCarro = findBookingRangeDateAndFinish.filter(
            (elt) => elt.id_vehicle.type_vehi.global === 1
        )
        //* |-> Filtraremos las reservas completadas por el tipo de vehiculo
        const filterBici = findBookingRangeDateAndFinish.filter(
            (elt) => elt.id_vehicle.type_vehi.global === 0
        )
        //* |-> Armamos el objeto y cargamos el arreglo de valores
        arrStatistic.push({ name: 'Moto', value: filterMoto.length }, { name: 'Carro', value: filterCarro.length }, { name: 'Bicicletas', value: filterBici.length })
        //* |-> Retornaremos al cliente que hizo la peticion el arreglo con los datos de la grafica
        return $Response(res, {
            status: 200,
            succ: true,
            msg: 'Busqueda exitosa!',
            data: arrStatistic
        })
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hace la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que mostrara el total de ganancias por un rango de fechas o del dia
const totalsParnetRangeDateOrDay = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos los parametros obligatorios del llamado api
    const { id_park, day_range } = req.params
    //* |-> Capturamos la query de fechas
    const query: any = req.query
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parquedero por el id suministrado
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(res, {
                status: 404,
                succ: false,
                msg: 'No se encuentra ningun parqueadero con los datos suministrados'
            })
        }
        //* |-> Validamos que el parqueadero corresponda al usuario que hace la consulta
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si el usuario no corresponde al que hace la busqueda retornaremos un error 401
            return $Response(res, {
                status: 401,
                succ: false,
                msg: 'Lo sentimos, No se puede consultar los datos de este parqueadero'
            })
        }
        //* |-> Validamos que el usuario sea un parqueadero
        if (user_t.parking === false) {
            //* |-> Retornaremos un error 401
            return $Response(res, {
                status: 401,
                succ: false,
                msg: 'Lo sentimos, los datos que intenta buscar no pueden ser suministrados'
            })
        }
        //* |-> Variable que segun el tipo de consulta retornara el total del dia o de un rango de fechas
        let totals;
        //* |-> Segun la consulta realizaremos
        if (day_range === 'true') { //? -> Buscara por un rango de fecha
            const findTotalsBookingRange = await Booking.find(
                {
                    $and: [
                        {
                            "date_booking.publish": {
                                $gte: new Date(query.start).toISOString(),
                                $lt: new Date(query.end).toISOString()
                            },
                            "parnet.status_parnet": true,
                            "id_park": findParkingId._id
                        }
                    ]
                }
            )
            //* |-> Si no encuentra ningun resultado retornaremos los totales en 0
            if (!findTotalsBookingRange || findTotalsBookingRange.length === 0) {
                totals = {
                    title: `Busqueda por rango: ${query.start} - ${query.end}`,
                    value: 0
                }
                return $Response(res, {
                    status: 400,
                    succ: false,
                    msg: 'No se encontro ningun resultado para esta busqueda!',
                    data: totals
                })
            }
            //* |-> Variable que contendra el total
            let total_r;
            //* |-> Barremos el arreglo y retornaremos el total
            for (let i = 0; i < findTotalsBookingRange.length; i++) {
                const {parnet} = findTotalsBookingRange[i];
                total_r += parnet.totals
            }
            //* |-> Armamos el objeto y retornamos los resultados
            totals = {
                title: `Busqueda por rango: ${query.start} - ${query.end}`,
                value: total_r
            }
            //* |-> Retornaremos al cliente que hizo la peticion un mensaje de exito 200
            return $Response(res, {
                status: 200,
                succ: true,
                msg: 'Busqueda exitosa!',
                data: totals
            })
        }else if (day_range === 'false') { //? -> Buscara por dia
            const findTotalsBookingDay = await Booking.find(
                {
                    $and: [
                        {
                            "date_booking.publish": new Date().toISOString(),
                            "parnet.status_parnet": true,
                            "id_park": findParkingId._id
                        }
                    ]
                }
            )
            //* |-> Si no encuentra ningun resultado retornaremos los totales en 0
            if (!findTotalsBookingDay || findTotalsBookingDay.length === 0) {
                totals = {
                    title: `Busqueda por dia: ${new Date().toISOString()}`,
                    value: 0
                }
                return $Response(res, {
                    status: 400,
                    succ: false,
                    msg: 'No se encontro ningun resultado para esta busqueda!',
                    data: totals
                })
            }
            //* |-> Variable que contendra el total
            let total_day;
            //* |-> Barremos el arreglo y retornaremos el total
            for (let i = 0; i < findTotalsBookingDay.length; i++) {
                const {parnet} = findTotalsBookingDay[i];
                total_day += parnet.totals
            }
            //* |-> Armamos el objeto y retornamos los resultados
            totals = {
                title: `Busqueda por dia: ${new Date().toISOString()}`,
                value: total_day
            }
            //* |-> Retornaremos al cliente que hizo la peticion un mensaje de exito 200
            return $Response(res, {
                status: 200,
                succ: true,
                msg: 'Busqueda exitosa!',
                data: totals
            })
        }
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Respondemos al cliente que hace la peticion un error 500
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/*************/
// TODO -> Exportacion del modulo
export {
    statisticTypeVehiParking,
    totalsParnetRangeDateOrDay
}