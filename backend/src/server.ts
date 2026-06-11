// Archivo principal del servidor, aquí se carga la configuración de variables de entorno, se conecta a la base de datos y se inicia el servidor
import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./config/database";

// cargar variables de entorno desde el archivo .env, esto permite configurar el puerto del servidor, la URL de la base de datos y otras opciones sin tener que modificar el código fuente
dotenv.config();

// definir el puerto del servidor, se toma de la variable de entorno PORT o se usa el valor por defecto 3000
const port = process.env.PORT || 3000;

// conectar a la base de datos y luego iniciar el servidor, si hay un error al conectar se muestra un mensaje en la consola y se termina el proceso con un código de error
connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor iniciado en puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar MongoDB", error);
    process.exit(1);
  });
