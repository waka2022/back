/*********/
//*! Importaciones
    //* |-> Express
    import express from 'express'
    //* |-> Cors
    import cors from 'cors'
    //* |-> Variables de entorno
    import { _port_, _url_api_ } from './environments/environments'
    //* |-> Configuracion
    import { staringDB } from './databases/config.database'
    //* |-> Rutas
        //? -_ Rutas de Users
        import routerUser from './routes/users.routes'
        //? -_ Rutas de autentificacion
        import routerAuth from './routes/auth.routes'
        //? -_ Ruta de Vehiculos
        import routerVehi from './routes/vehicle.routes'
        //? -_ Ruta de parqueaderos
        import routerPark from './routes/parking.routes'
        //? -_ Ruta de Files
        import routerFiles from './routes/files.routes'
        //? -_ Ruta de Reservas
        import routerBooking from './routes/bookings.routes'
        //? -_ Ruta de facturas
        import routerInvoiced from './routes/invoiced.routes'
/*********/
//? -_ Inicializacion de aplicacion express
const app = express()
/*********/
//? -_ Configuracion del cors
app.use(cors())
//? -_ Inicializacion de dbms
staringDB()
//? -_ Configuracion del parseo
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/*********/
//? -_ Configuracion de rutas de entrada
    //* |-> Path que definirà las rutas de usuarios
    app.use(`${_url_api_}/users`, routerUser)
    //* |-> Path que definirà las rutas de autentificacion
    app.use(`${_url_api_}/auth`, routerAuth)
    //* |-> Path que definirà las rutas de vehiculos
    app.use(`${_url_api_}/vehicle`, routerVehi)
    //* |-> Path que definira las rutas de parqueaderos
    app.use(`${_url_api_}/parking`, routerPark)
    //* |-> Path que definira las rutas de archivos (Files)
    app.use(`${_url_api_}/files`, routerFiles)
    //* |-> Path que definira las rutas de reservaciones
    app.use(`${_url_api_}/booking`, routerBooking)
    //* |-> Path que definira las rutas de facturacion
    app.use(`${_url_api_}/invoiced`, routerInvoiced)
/*********/
// TODO -> Inicializacion de aplicacion express
app.listen(_port_, () => console.log(`Server online in port: ${_port_}`))