# Estructura del backend

Este archivo es solo documentacion interna. No se importa desde el sistema ni cambia el funcionamiento de la API.

## Entrada de la aplicacion

- `src/server.ts`: carga variables de entorno, conecta MongoDB y levanta el servidor Express.

- `src/app.ts`: crea la app Express, habilita CORS y JSON, define el endpoint raiz `/` y monta todas las rutas bajo `/v1`.

- `src/routes/index.ts`: concentra las rutas principales y conecta cada modulo con su prefijo:
  - `/v1/auth`
  - `/v1/users`
  - `/v1/categories`
  - `/v1/expenses`
  - `/v1/budgets`
  - `/v1/goals`
  - `/v1/dashboard`
  - `/v1/reports`

## Carpetas principales

- `src/config`: configuracion compartida. `database.ts` se encarga de conectar con MongoDB usando Mongoose.
- `src/middleware`: funciones que se ejecutan antes de los controladores. `auth.middleware.ts` valida el token y agrega el usuario autenticado al request.
- `src/models`: modelos de Mongoose. Definen la forma de los datos guardados en MongoDB: usuarios, tokens, categorias, gastos, presupuestos, metas, etc.
- `src/modules`: contiene la logica separada por funcionalidad del sistema.
- `src/routes`: punto central donde se agrupan y montan las rutas de todos los modulos.

## Como se organiza cada modulo

Cada carpeta dentro de `src/modules` sigue la misma idea:

- `*.routes.ts`: define las URLs del modulo y que controlador atiende cada metodo HTTP.
- `*.controller.ts`: recibe el request, llama al servicio correspondiente y devuelve la respuesta HTTP.
- `*.service.ts`: contiene la logica principal, consulta modelos y aplica validaciones de negocio.

Ejemplo con gastos:

1. El frontend llama a `/v1/expenses`.
2. `src/routes/index.ts` deriva esa URL a `src/modules/expenses/expenses.routes.ts`.
3. `expenses.routes.ts` aplica `authenticate` y llama al controlador.
4. `expenses.controller.ts` toma datos del request y llama a `expenses.service.ts`.
5. `expenses.service.ts` usa `Expense` y `Category` desde `src/models`.
6. El controlador devuelve el resultado al frontend.

## Relacion general de archivos

`server.ts` inicia todo. `app.ts` arma Express. `routes/index.ts` conecta los modulos. Cada modulo pasa por `routes -> controller -> service -> models`. El middleware de autenticacion se usa en rutas protegidas para que los servicios trabajen con el usuario correcto.

## Archivos generados o externos

- `dist`: salida compilada de TypeScript. Se genera con `npm run build`.
- `node_modules`: dependencias instaladas.
- `package.json`: scripts y dependencias del backend.
- `tsconfig.json`: configuracion de TypeScript.
- `.env`: variables locales como puerto, conexion a MongoDB y secretos.
