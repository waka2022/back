# Proyecto WAKA -> Backend 🧑🏻‍💻
## Descripcion 📃:
_Repositorio que almacenara el contexto general y principal de la logica de negocio planteada en los requerimientos planteados del proyecto waka_

## Estructura del proyecto
_El proyecto se encuentra basado en el superset de JS como lo es TS (Typescript) para asi tener mas control en el tipado del proyecto con interfaces para recibir la informacion correspondiente._

## Estructura de carpetas 📂:
_Una estructura de carpetas simple y entendible para un entorno backend en una API REST_
```
    |_README.md
    |_.gitignore
    |_package.json
    |_src/
      |_controllers
      |_databases
      |_environments
      |_helpers
      |_interface
      |_middlewares
      |_models
      |_routes
      |_services
      |_templates
      |_index.ts
```
## Descripcion de la estructura:
* .gitignore: _Archivo que ignorara algunas carpetas, archivos o dependencias al subirlo a git._
* package.json: _Archivo que contendra el proyecto de node junto con su nombre, descripcion, dependencias y scripts._
* src: _Carpeta que almacenara la logica del servidor back waka._
* controllers: _Carpeta que almacenara cada uno de los controladores nesesarios de la aplicacion._
* databases: _Carpeta que almacenara el archivo de conexion al cluster de mongodb._
* environments: _Carpeta que almacenara todas las variables globales de entorno que se utilizaran a lo largo de la aplicacion._
* helpers: _Carpeta que almacenara las funciones que ayudara en el desarrollo y funcionamiento de la aplicacion._
* interface: _Carpeta que almacenara las interfaces que se utilizaran a lo largo de la aplicacion._
* middlewares: _Carpeta que almacenara funciones de validacion que se utilizaran a lo largo de la aplicacion._
* models: _Carpeta que almacenara los schemas o colecciones que se usaran en la base de datos._
* routes: _Carpeta que almacenara las rutas nesesarias para utilizar debidamente la aplicacion._
* services: _Carpeta que almacenara algunas funciones que reducen el proceso de codigo a lo largo de la aplicacion._
* templates: _Carpeta que almacenra los templates o plantillas que se enviaran por correo._
* index.ts: _Archivo que inicia la logica del servidor._

## Vinculos:
* Postman (API) documentacion: ```https://documenter.getpostman.com/view/19653538/UVkmQcek```

## Recomendaciones 👀:
* Leer la documentacion de los README.md
* Tener instalado typescript y node en la maquina que se utilizara
* Solicitar al equipo de desarrollo de waka las variables de ambiente .env
---
Kevin Fraile, Angely Rojas, Nicolas Duarte, Samuel Cano
