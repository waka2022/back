/**********/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> Modelo de Vehiculos
    import Vehicle from '../models/vehicle.model'
    //* |-> Interfaces
    import { _vehicle_create } from '../interface/interface.interface'
    //* |-> Services
        //? -> Response
        import { $Response } from '../services/resp.services'
    //* |-> Environments
    import { _cloud_product_, _key_files_, _url_socket_ } from '../environments/environments'
    //* |-> Axios
    import axios from 'axios'
/**********/ /* //? CRUD ?\\ */ /**********/
//? -_ Controlador que mostrara todos los vehiculos de un usuario
const viewVehicleUser = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscaremos todos los vehiculos de un usuario segun su _id
        const findVehiUser = await Vehicle.find({ id_user: user_t._id })
        //* |-> Si no encuentra ningun documento realcionado retornaremos un error 404
        if (!findVehiUser || findVehiUser.length === 0) {
            return $Response(
                res,
                { succ: false, status: 404, msg: `${ _cloud_product_ === 'false' ? 'No se encontro ningun vehiculo' : `No tienes ningun vehiculo inscrito en waka` }` }
            )
        }
        //* |-> Si encuentra algun documento realcionado lo retornaremos con un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findVehiUser }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que mostrara un vehiculo segun su id
const viewVehicleUnique = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del vehiculo a consultar
    const { id_vehi }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el vehiculo por el id suministrado
        const findVehicleId = await Vehicle.findById(id_vehi)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findVehicleId || findVehicleId === null || findVehicleId === undefined) {
            return $Response(
                res,
                { succ: false, status: 404, msg: `${ _cloud_product_ === 'false' ? 'No se encontro el vehiculo por el id' : 'Lo sentimos, WAKA no encuentra tu vehiculo' }` }
            )
        }
        //* |-> Validamos que el usuario que hace la peticion sea el que creo el vehiculo
        if (String(user_t.id) !== String(findVehicleId.id_user)) {
            //* |-> Si No son iguales retornaremos un error 401
            return $Response(
                res,
                { succ: false, status: 404, msg: `${ _cloud_product_ === 'false' ? 'No se encontro el vehiculo por el id' : 'Lo sentimos, WAKA no encuentra tu vehiculo' }` }
            )
        }
        //* |-> Retornaremos un mensaje de exito 200
        return $Response(
            res,
            { succ: true, status: 200, msg: 'Busqueda exitosa!', data: findVehicleId }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que creara y añadira un vehiculo a un usuario registrado
const createVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos al cliente que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el cuerpo del nuevo vehiculo
    const body: _vehicle_create = req.body
    //* |-> Control de errores tryCatch
    try {
        //? ({Negocio -> Buscar cuantos vehiculos tiene un usuario si es > 2 bloqueamos si no tiene suscripcion})
        /**
         * 
         */
        //* |-> Armamos el cuerpo del schema del vehiculo
        const vehicle: _vehicle_create = {
            id_user: user_t._id,
            type_vehi: {
                global: Number(body.type_vehi.global),
                mark: body.type_vehi.mark.toLocaleLowerCase(),
                model: body.type_vehi.model.toLocaleLowerCase(),
                placa: body.type_vehi.placa.toLocaleUpperCase(),
                color: body.type_vehi.color
            }
        }
        //* |-> Armamos el nuevo modelo de datos
        const new_vehicle = new Vehicle(vehicle)
        //* |-> Almacenamos el nuevo modelo
        await new_vehicle.save()
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-vehicle`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Respondemos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `${ _cloud_product_ === 'false' ? 'Se creo correctamente el vehiculo' : `Se añadio correctamente tu ${vehicle.type_vehi.global}!` }` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que actualizara un vehiculo
const updateVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el cuerpo del vehiculo a actualizar
    const body = req.body
    //* |-> Capturamos el id del vehiculo
    const { id_vehi } = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos si existe el vehiculo por el id suministrado
        const findVehicleId = await Vehicle.findById(id_vehi)
        //* |-> Si no encuentra ningun documento relacionado por el id del vehiculo retornaremos 404
        if (!findVehicleId || findVehicleId === null || findVehicleId === undefined) {
            return $Response(
                res,
                { succ: false, status: 404, msg: `${ _cloud_product_ === 'false' ? 'No se encontro el vehiculo por el id' : 'Lo sentimos, WAKA no encuentra tu vehiculo' }` }
            )
        }
        //* |-> Comprovamos que el usuario que actualiza el vehiculo sea el mismo que hace la peticion
        if (String(findVehicleId.id_user) !== String(user_t._id)) {
            //* |-> Si sion diferentes retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No es el mismo usuario que hace la peticion' : `Lo sentimos, no puedes generar cambios en este vehiculo!` }` }
            )
        }
        //* |-> Armamos el cuerpo del schema del vehiculo
        const vehicle: _vehicle_create = {
            type_vehi: {
                global: Number(body.type_vehi.global),
                mark: body.type_vehi.mark.toLocaleLowerCase(),
                model: body.type_vehi.model.toLocaleLowerCase(),
                placa: body.type_vehi.placa.toLocaleUpperCase(),
                color: body.type_vehi.color
            }
        }
        //* |-> Actualizaremos el vehiculo por la informacion suministrada
        await Vehicle.findByIdAndUpdate(
            id_vehi,
            vehicle
        )
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-vehicle`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Retornamos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `Se actualizo correctamente tu vehiculo!` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que eliminara un vehiculo
const deleteVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del vehiculo que se va a eliminar
    const { id_vehi }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscaremos el vehiculo por el id suministrado
        const findVehicleId = await Vehicle.findById(id_vehi)
        //* |-> Si no encuentra ningun documento relacionado, retornaremos un error 404
        if (!findVehicleId || findVehicleId === null || findVehicleId === undefined) {
            return $Response(
                res,
                { succ: false, status: 404, msg: `${ _cloud_product_ === 'false' ? 'No se encontro el vehiculo por el id' : 'Lo sentimos, WAKA no encuentra tu vehiculo' }` }
            )
        }
        //* |-> Validamos que el usuario que hace la peticion sea el mismo que creo el vehiculo
        if (String(user_t._id) !== String(findVehicleId.id_user)) {
            //* |-> Si no son iguales retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No es el mismo usuario que hace la peticion' : `Lo sentimos, no puedes generar cambios en este vehiculo!` }` }
            )
        }
        //* |-> Si es el mismo usuario el del vehiculo se eliminara de la base de datos
        await Vehicle.findByIdAndDelete(id_vehi)
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-vehicle`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Retornamos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Se elimino correctamente el vehiculo' : `Se ha eliminado correctamente el vehiculo inscrito con placas ${findVehicleId.type_vehi.placa}` }` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que actualizara la ubicacion de las imagenes para un vehiculo
const photoVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el { id && act } de los parametros request
    const { id_vehicle, act }: string | any = req.params
    //* |-> Capturamos la url por el body de la request
    const { urls }: string[] | any = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el vehiculo por el id suministrado
        const findVehicleId = await Vehicle.findById(id_vehicle)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findVehicleId || findVehicleId === null || findVehicleId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'Lo sentimos no se encontro ningun vehiculo con la informacion suministrada' }
            )
        }
        //* |-> Validamos que el usuario que hace la accion sea el mismo que creo el vehiculo
        if (String(user_t._id) !== String(findVehicleId.id_user)) {
            //* |-> Si no son iguales retornaremos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos pero no puedes manipular estos archivos' }
            )
        }
        //* |-> Variable que almacenara las rutas de las imagenes
        let photo: string[] = findVehicleId.photo
        //* |-> Validamos la accion a realizar
        switch (Number(act)) {
            case 0: //? Añadir
                    //* |-> Barremos el arreglo de las urls entrantes
                    urls.forEach((elt: any) => {
                        //* |-> Añadimos las nuevas urls
                        photo.push(elt)
                    });
                break;
            case 1: //? Eliminar
                    //* |-> Barreremos el arreglo de las urls entrantes
                    urls.forEach((elt: any) => {
                        //* |-> Validamos si existen las urls en el arreglo existente
                        const existUrl = photo.includes(elt)
                        //* |-> Si existe buscaremos el index para poderlo eliminar
                        if (existUrl === true) {
                            const existUrlIndex = photo.findIndex((elt_i: any) => elt_i === elt)
                            //* |-> Eliminaremos la posicion del elemento existente
                            photo.splice(existUrlIndex, 1)
                        }
                    });
                break;
            default:
                break;
        }
        //* |-> Actualizaremos el modelo del vehiculo para agregar el nuevo arreglo de fotos
        await Vehicle.findByIdAndUpdate(id_vehicle, { photo })
        //* |-> Retornaremos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `Se a ${ Number(act) === 0 ? 'agregado' : 'eliminado' } correctamente la imagen!` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/**********/ /* //? Cambios de estados ?\\ */ /**********/
//? -_ Controlador que cambiara el estado de un vehiculo a uso y apagara el anterior
const changeStatusVehicle = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del vehiculo que se activara
    const { id_vehi }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos los vehiculos inscritos por el usuario
        const findVehicleUser = await Vehicle.find({ id_user: user_t._id })
        //* |-> Si no encuentra ningun vehiculo retornaremos un error 404
        if (!findVehicleUser || findVehicleUser.length === 0) {
            return  $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No tiene vehiculos' : `Lo sentimos, no encontramos alguno de tus vehiculos... Crea tu primer vehiculo ahora!` }` }
            )
        }
        //* |-> Buscamos el vehiculo por el id suministrado por los parametros
        const findVehicleId = await Vehicle.findById(id_vehi)
        //* |-> Si no existe retornamos un error 404
        if (!findVehicleId || findVehicleId === null || findVehicleId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No existe el vehiculo por el id suministrado' : `Lo sentimos, No se encuentra el vehiculo seleccionado` }` }
            )
        }
        //* |-> Validamos que los vehiculos inscritos sean mayores a 1
        if (findVehicleUser.length === 1) {
            //* |-> Actualizamos el unico registro del vehiculo (Que seria el vehiculo seleccionado)
            await Vehicle.findByIdAndUpdate(id_vehi, { status: findVehicleId.status === true ? false : true })
        }
        //* |-> Barremos el arreglo de vehiculos de un usuario
        findVehicleUser.forEach(async(elt) => {
            await Vehicle.findByIdAndUpdate(elt._id, { status: false })
        });
        //* |-> Activamos el vehiculo seleccionado
        await Vehicle.findByIdAndUpdate(id_vehi, { status: true })
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-vehicle`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Retornamos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: `Estado del vehiculo ${findVehicleId.type_vehi.placa} actualizado` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
/**********/
// TODO -> Exportacion de controladores
export {
    //? CRUD
    createVehicle,
    viewVehicleUser,
    viewVehicleUnique,
    updateVehicle,
    deleteVehicle,
    photoVehicle,
    //? Cambios de estados
    changeStatusVehicle
}