/**********/
//*! Importaciones
    //* |-> { Request, Response } - express
    import { Request, Response } from 'express'
    //* |-> Parking modelo
    import Parking from '../models/parking.model'
    //* |-> Environments
    import { _cloud_product_, _key_files_, _url_socket_ } from '../environments/environments'
    //* |-> { $Response } - services
    import { $Response } from '../services/resp.services'
    //* |-> Interface
    import { _parking_create } from '../interface/interface.interface'
    //* |-> axios
    import axios from 'axios'
/**********/
//? -_ Controlador que mostrara todos los parqueaderos de un usuario
const viewAllParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validamos que el usuario que hace la peticion sea un parqueadero
        if (user_t.parking === false) {
            //* |-> Si no es un parqueadero retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No es un usuario registrado como parqueadero' : `Lo sentimos pero no puedes registrar un parqueadero ya que no te registraste como uno` }` }
            )
        }
        //* |-> Buscaremos los parqueaderos inscritos por el usuario
        const findParkingUser = await Parking.find({ id_user: user_t._id })
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingUser || findParkingUser.length === 0) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No tiene ningun parqueadero inscrito' : `Lo sentimos, parece que no tienes ningun parqueadero inscrto... Inscribe el primero ahora!` }` }
            )
        }
        //* |-> Responderemos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findParkingUser }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })        
    }
}
//? -_ Controlador que mostrara un parqueadero especifico segun su id
const viewUniqueParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del parqueadero a ver
    const { id_park }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parqueadero por el id suministrado
        const findParkingId = await Parking.findById(id_park).populate('id_user', 'names phone')
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encontro un parqueadero por el id suministrado' : `Lo sentimos pero parece que no existe o no encontramos el parqueadero que seleccionaste` }` }
            )
        }
        //* |-> Retornamos un mensaje de exito 200
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findParkingId }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que mostrara los parqueaderos habilitados
const viewAllAbilityParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario bp que hace la peticion
    const { user_t }: any = req
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos todos los parqueaderos disponibles
        const findAllParkingAbility = await Parking.find({ availability: true, ubi: { $exists: true, $ne: null } }).populate('id_user', 'names phone')
        //* |-> Si no encuentra ningun parqueadero disponible retornaremos un error 404
        if (!findAllParkingAbility || findAllParkingAbility === null || findAllParkingAbility === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No hay parqueaderos disponibles' : `Lo sentimos, no hay parqueaderos cercanos disponibles en waka` }` }
            )
        }
        //* |-> Respondemos con los parqueaderos cercanos
        return $Response(
            res,
            { status: 200, succ: true, msg: 'Busqueda exitosa!', data: findAllParkingAbility }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })        
    }
}
//? -_ Controlador que creara un parqueadero
const createParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el cuerpo del parqueadero
    const body = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Validamos que el usuario se haya registrado como parqueadero
        if (user_t.parking === false) {
            //* |-> Si no es un parqueadero retornaremos un error 400
            return $Response(
                res,
                { status: 400, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No es un usuario registrado como parqueadero' : `Lo sentimos pero no puedes registrar un parqueadero ya que no te registraste como uno` }` }
            )
        }
        //* |-> Armamos el cuerpo de el parking
        const parking: _parking_create = {
            id_user: user_t._id,
            ...body
        }
        //* |-> Instanciamos un nuevo parqueadero en el modelo
        const new_parking = new Parking(parking)
        //* |-> Almacenamos ese parqueadero en la instacia de el dbms
        new_parking.save()
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
            { status: 200, succ: true, msg: `${ _cloud_product_ === 'false' ? 'Se creo el parqueadero correctamente' : `Se ha creado con exito tu parqueaderoen la direccion ${body.address}` }` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })        
    }
}
//? -_ Controlador que actualizara un parqueadero segun su id
const updateParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del parqueadero
    const { id_park }: string | any = req.params
    //* |-> Capturamos el cuerpo que se va a actualizar
    const body: _parking_create = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parqueadero por el id suministrado
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no existe el paqueadero retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encontro un parqueadero por el id suministrado' : `Lo sentimos pero parece que no existe o no encontramos el parqueadero que seleccionaste` }` }
            )
        }
        //* |-> Validamos que el usuario que actualiza sea el mismo que lo registro
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si no son iguales retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Peticion no autorizada para este usuario' : `Lo sentimos, las politicas de waka no permiten que tu actualices este parqueadero` }` }
            )
        }
        //* |-> Actualizaremos el parqueadero con la informacion suministrada
        await Parking.findByIdAndUpdate(id_park, body)
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
            { status: 200, succ: true, msg: `Se actualizo correctamente tu parqueadero!` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })        
    }
}
//? -_ Controlador que añadira o actualizara las coordenadas de parqueadero
const updateUbiParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del parqueadero a actualizar
    const { id_park }: string | any = req.params
    //* |-> Capturamos la ubicacion del parqueadero
    const body: { ubi:{ lon: number; lat: number } } = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parqueadero por el id suministrado
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no encuenta ningun resultado retornaremos un un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encontro un parqueadero por el id suministrado' : `Lo sentimos pero parece que no existe o no encontramos el parqueadero que seleccionaste` }` }
            )
        }
        //* |-> Validamos que el usuario que actualiza sea el mismo que lo registro
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si no son iguales retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Peticion no autorizada para este usuario' : `Lo sentimos, las politicas de waka no permiten que tu elimines este parqueadero` }` }
            )
        }
        //* |-> Actualizaremos la ubicacion del parqueadero
        await Parking.findByIdAndUpdate(id_park, { ubi: body.ubi })
        //* |-> Enviamos la peticion para la emision del socket
        await axios.get(
            `${ _url_socket_ }/new-parking`,
            {
                headers: {
                    'auth-key':  _key_files_
                }
            }
        )
        //* |-> Respondemos al cliente que hizo la peticion un mensaje de exito
        return $Response(
            res,
            { succ: true, status: 200, msg: `${ _cloud_product_ === 'false' ? 'Se actualizo correctamente la ubicacion del parqueadero' : `Tu parqueadero tiene nuevas coordenadas!`}` }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que eliminara un parqueadero segun su id
const deleteParking = async(req: Request, res: Response) => {
    //* |-> Capturamos al usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos el id del parqueadero a eliminar
    const { id_park }: string | any = req.params
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parqueadero por el id suministrado
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no existe el paqueadero retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: `${ _cloud_product_ === 'false' ? 'No se encontro un parqueadero por el id suministrado' : `Lo sentimos pero parece que no existe o no encontramos el parqueadero que seleccionaste` }` }
            )
        }
        //* |-> Validamos que el usuario que elimina sea el mismo que lo registro
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si no son iguales retornaremos un error 401
            return $Response(
                res,
                { status: 401, succ: false, msg: `${ _cloud_product_ === 'false' ? 'Peticion no autorizada para este usuario' : `Lo sentimos, las politicas de waka no permiten que tu elimines este parqueadero` }` }
            )
        }
        //* |-> Eliminamos el documento
        await Parking.findByIdAndDelete(id_park)
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
            { status: 200, succ: true, msg: 'Se elimino correctamente el parqueadero!' }
        )
    } catch (err) {
        //*! Imprimimos por consola el error
        console.log(err);
        //*! Retornamos un error 500 al cliente que hace la peticion
        return $Response(res, { status: 500, succ: false, msg: `${_cloud_product_ === 'false' ? 'Ups... ocurrio un problema revisa los logs' : 'Tuvimos un error al procesar los datos, comunicate con nuestro equipo tecnico!'}` })
    }
}
//? -_ Controlador que actualizara el arreglo de imagenes para un parqueadero
const photosParking = async(req: Request, res: Response) => {
    //* |-> Capturamos el usuario que hace la peticion
    const { user_t }: any = req
    //* |-> Capturamos { id && accion } de los parametros request
    const { id_park, act }: string | any = req.params //? act { 0: añadir, 1: eliminar }
    //* |-> Capturamos a url por el body request
    const { urls }: string[] | any = req.body
    //* |-> Control de errores tryCatch
    try {
        //* |-> Buscamos el parqueadero por el id suministrado
        const findParkingId = await Parking.findById(id_park)
        //* |-> Si no encuentra ningun documento relacionado retornaremos un error 404
        if (!findParkingId || findParkingId === null || findParkingId === undefined) {
            return $Response(
                res,
                { status: 404, succ: false, msg: 'No se encontro el parqueadero por la informacion suministrada' }
            )
        }
        //* |-> Validamos que el usuario del parqueadero sea el mismo que esta actualizado sus imagenes
        if (String(user_t._id) !== String(findParkingId.id_user)) {
            //* |-> Si son diferentes retornaremos un error 403
            return $Response(
                res,
                { status: 403, succ: false, msg: 'Lo sentimos pero no puedes manupular estos archivos' }
            )
        }
        //* |-> Variable que almacenara las rutas de las imagenes
        let photo: string[] = findParkingId.photo
        //* |-> Validamos la accion
        switch (Number(act)) {
            case 0: //? Añadir
                    //* |-> Barreremos el arreglo de las urls entrantes
                    urls.forEach((elt: any) => {
                        //* |-> Añadiremos las nuevas urls
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
        //* |-> Actualizaremos el modelo del parqueadero para agregar el nuevo arreglo de fotos
        await Parking.findByIdAndUpdate(id_park, { photo })
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
/**********/
// TODO -> Exportacion de controladores
export {
    createParking,
    viewAllParking,
    viewUniqueParking,
    updateParking,
    deleteParking,
    updateUbiParking,
    photosParking,
    viewAllAbilityParking
}