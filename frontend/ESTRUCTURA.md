# Estructura del frontend

Este archivo es solo documentacion interna. No se importa desde la app ni se muestra en pantalla.

## Entrada de la aplicacion

- `index.html`: archivo HTML base donde Vite monta React.
- `src/main.tsx`: punto de entrada de React. Renderiza `App` dentro del elemento `root`.
- `src/App.tsx`: decide que pagina mostrar segun `window.location.pathname`, maneja la navegacion interna y envuelve las paginas privadas con `AppLayout`.

## Carpetas principales

- `src/api`: funciones para comunicarse con el backend.
- `src/components`: componentes reutilizables que no son paginas completas.
- `src/components/layout`: estructura visual compartida por las pantallas internas.
- `src/pages`: pantallas principales de la aplicacion.
- `src/store`: estado compartido de autenticacion.
- `src/utils`: utilidades generales, como notificaciones.
- `src/assets`: archivos estaticos usados por React.

## Como se conectan los archivos

1. `src/main.tsx` carga `src/App.tsx`.
2. `App.tsx` mira la ruta actual y elige una pagina de `src/pages`.
3. Las paginas internas se muestran dentro de `AppLayout`.
4. `AppLayout` usa `Sidebar` para navegar entre secciones.
5. Las paginas llaman funciones de `src/api/finance.ts` o usan `src/store/auth.store.ts`.
6. `src/api/finance.ts` usa `src/api/client.ts` para hacer requests HTTP al backend.
7. `src/api/client.ts` configura Axios con la URL base del backend y agrega el token JWT cuando existe.

## Archivos importantes

- `src/api/client.ts`: cliente Axios central. Usa `VITE_API_URL` o `http://localhost:3000/v1` por defecto. Tambien intenta renovar tokens cuando recibe un 401.
- `src/api/finance.ts`: funciones concretas para dashboard, gastos, categorias, presupuestos, metas y reportes.
- `src/store/auth.store.ts`: maneja login, registro, logout, usuario actual y tokens guardados en `localStorage`.
- `src/components/ToastNotifications.tsx`: escucha eventos de notificacion y los muestra en pantalla.
- `src/utils/toast.ts`: dispara notificaciones mediante eventos del navegador.

## Paginas

- `Landing.tsx`: pantalla inicial publica.
- `Login.tsx`: inicio de sesion.
- `Register.tsx`: registro de usuario.
- `Dashboard.tsx`: resumen general.
- `Expenses.tsx`: gestion de gastos.
- `Categories.tsx`: gestion de categorias.
- `Budgets.tsx`: gestion de presupuestos.
- `Goals.tsx`: gestion de metas.
- `Reports.tsx`: descarga de reportes.
- `Calendar.tsx`: vista de calendario.
- `Settings.tsx`: configuracion.

## Relacion con el backend

El frontend se comunica con la API usando Axios. Las llamadas salen desde `src/api/finance.ts` y `src/store/auth.store.ts`, pasan por `src/api/client.ts` y llegan al backend bajo `/v1`. Por ejemplo, `getExpenses()` llama a `/expenses`, que en el backend corresponde a `/v1/expenses`.

## Archivos generados o externos

- `dist`: salida generada por `npm run build`.
- `node_modules`: dependencias instaladas.
- `package.json`: scripts y dependencias del frontend.
- `vite.config.js`: configuracion de Vite.
- `tailwind.config.js`: configuracion de Tailwind.
- `tsconfig.json` y `tsconfig.node.json`: configuracion de TypeScript.
