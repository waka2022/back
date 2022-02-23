/***********/
//*! Importaciones
    //* |-> { next, request, response } - express
    import { Request, Response, NextFunction } from 'express'
    //* Validador de express
    import { validationResult } from 'express-validator'
/***********/
//? -_ Middleware que validara los campos de una peticion
const checkedResults = async( req: Request, res: Response, next: NextFunction ) => {
    //* |-> Capturamos los valores de la request
    const values = validationResult(req)
    //* |-> Si algun campo de la reques se encuentra vacio retornaremos un error 400
    if (!values.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Campo no valido',
            data: values.mapped()
        })
    }
    //* |-> Si todo se encuentra bien continuaremos con la funcionalidad del controlador siguiente
    next()
}
/***********/
// TODO -> Exportacion del modulo
export {
    checkedResults
}