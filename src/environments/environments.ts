/*********/
//*! Importaciones
    //* |-> Dotenv
    import dotenv from 'dotenv'
/*********/
//? -_ Inicializacion de configuracion de ambiente
dotenv.config()
/*********/
//? -_ Variables no exportables
const _user_mongo_: string = String(process.env.USER_MONGO)
const _pass_mongo_: string = String(process.env.PASS_MONGO)
const _cloud_product_: string = String(process.env.CLOUD_PRODUCT)
/*********/
//? -_ Variables exportables
const _port_: number = Number(process.env.PORT)
const _url_connect_: string = `mongodb+srv://${_user_mongo_}:${_pass_mongo_}@waka-data.j9ze3.mongodb.net/${_cloud_product_ === 'false' ? 'waka_local' : 'waka_prod'}`
//? *PATH* localhost:1805/v1/{local||producction}
const _url_api_: string = `${String(process.env.URL_L_P)}/${_cloud_product_ === 'false' ? 'local' : 'producction'}`
const _secret_token_: string = String(process.env.SECRET_TOKEN)
const _google_client_: string = String(process.env.GOOGLE_CLIENT)
const _goo_key_api_: string = String(process.env.API_KEY_GOOGLE)
const _goo_key_: string = String(process.env.GOOGLE_KEY)
const _redirect_api_goo_: string = String(process.env.PATH_REDIRECT_GOO)
const _email_def_: string = String(process.env.EMAIL_DEF)
const _urls_template_: string = _cloud_product_ === 'false' ? 'http://localhost:4200/' : 'https://wakaview.herokuapp.com/'
const _secret_token_files_: string = String(process.env.SECRET_TOKEN_FILES)
const _key_files_: string = String(process.env.SECRET_KEY)
const _url_waka_files_: string = `${ _cloud_product_ === 'false' ? 'http://localhost:2000/waka-files/v1' : '' }`
const _url_socket_: string = `${ _cloud_product_ === 'false' ? 'http://localhost:2105/v1/socket' : 'https://wakasocket.herokuapp.com/v1/socket' }`
/*********/
// TODO -> Exportacion de modulo
export {
    _port_,
    _url_connect_,
    _url_api_,
    _cloud_product_,
    _secret_token_,
    _google_client_,
    _goo_key_api_,
    _goo_key_,
    _redirect_api_goo_,
    _email_def_,
    _urls_template_,
    _secret_token_files_,
    _key_files_,
    _user_mongo_,
    _pass_mongo_,
    _url_waka_files_,
    _url_socket_
}