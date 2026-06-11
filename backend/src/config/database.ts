// Archivo de configuración de la base de datos, aquí se define la función para conectar a la base de datos MongoDB utilizando Mongoose, se obtiene la URI de conexión de las variables de entorno y se maneja el caso en que no esté configurada, si la conexión es exitosa se puede utilizar Mongoose para interactuar con la base de datos en el resto del proyecto
import mongoose from "mongoose";

// definir la función para conectar a la base de datos MongoDB utilizando Mongoose, se obtiene la URI de conexión de las variables de entorno y se maneja el caso en que no esté configurada, si la conexión es exitosa se puede utilizar Mongoose para interactuar con la base de datos en el resto del proyecto
export const connectDatabase = async () => {
  // obtener la URI de conexión de las variables de entorno, se espera que esté definida en la variable MONGO_URI, si no está configurada se lanza un error para evitar intentar conectar a una base de datos sin una URI válida
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI no configurado");
  }

  await mongoose.connect(mongoUri);
};
