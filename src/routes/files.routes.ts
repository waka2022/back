/*********/
//*! Importaciones
    //* |-> Router { express }
    import { Router } from 'express'
    //* |-> Middlewares
    import { valid_jwt, valid_jwt_files } from '../middlewares/valid_jwt.middleware'
    //* |-> Controllers
    import { credentials, uploadPhoto } from '../controllers/files.controller'
    //* |-> file-express
    import fileUpload from 'express-fileupload'
/*********/
//? -_ Activamos las rutas
const router: Router = Router()
//* |-> Apertura de configuracion depara el tramite de archivos fileUpload
router.use(fileUpload())
/*********/
//? -_ Definicion de rutas
    //? $GET
        //* |-> Ruta que entregara datos sencibles del dbms { user, pass }
        router.get(
            '/waka-connect/waka-files/secret-credentials',
            [ valid_jwt_files ],
            credentials
        )
        //* |-> Ruta que subira un archivo a waka files
        router.get(
            '/waka-connect/waka-files/upload-photos/:type/:id_type?',
            [ valid_jwt ],
            uploadPhoto
        )
    //? $POST
    //? $PUT
    //? $DELETE
/*********/
// TODO -> Exportacion por defecto de las rutas
export default router