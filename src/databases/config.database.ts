/***********/
//*! Importaciones
    //* |-> Mongosee
    import mongo from 'mongoose'
    //* |-> { url_connect } environment
    import { _url_connect_ } from '../environments/environments'
/***********/
//? -_ Conexion con la url mongo
export const staringDB = async() => {
    //* |-> Control de errores tryCatch
    try {
        //* |-> Realizamos la conexion por la url suministrada
        await mongo.connect(_url_connect_)
        //* |-> Retornamos por consola un mensaje de conexion
        console.log('Success staring dbms');
    } catch (err) {
        //*! Imprimimos el error por consola
        console.log(err);
        //*! Retornamos un error de conexion
        throw new Error('Error when staring dbms!');
    }
}
/***********/