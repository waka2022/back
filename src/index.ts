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
/*********/
// TODO -> Inicializacion de aplicacion express
app.listen(_port_, () => console.log(`Server online in port: ${_port_}`))