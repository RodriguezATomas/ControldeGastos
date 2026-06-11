// Archivo de modelo para el token, aquí se define el esquema de Mongoose para el token, que incluye campos como user (referencia al usuario al que pertenece el token) y token (cadena de texto que representa el token), también se exporta el modelo de Mongoose para poder utilizarlo en otras partes del proyecto
import mongoose, { Schema } from "mongoose";

// definir el esquema de Mongoose para el token, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo user es una referencia a un documento de usuario que también es requerido y token es una cadena de texto requerida, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
const tokenSchema = new Schema(
  {
    // definir los campos del esquema de Mongoose para el token, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo user es una referencia a un documento de usuario que también es requerido y token es una cadena de texto requerida, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// exportar el modelo de Mongoose para el token, esto permite utilizar el modelo en otras partes del proyecto para crear, leer, actualizar y eliminar documentos de token en la base de datos
export const Token = mongoose.model("Token", tokenSchema);
