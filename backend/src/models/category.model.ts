// Archivo de modelo para la categoría, aquí se define el esquema de Mongoose para la categoría, que incluye campos como name (nombre de la categoría) y user (referencia al usuario al que pertenece la categoría), también se exporta el modelo de Mongoose para poder utilizarlo en otras partes del proyecto
import mongoose, { Schema } from "mongoose";

// definir la interfaz ICategory que extiende de mongoose.Document, esta interfaz representa la estructura de un documento de categoría en la base de datos, incluye campos como name (nombre de la categoría) y user (referencia al usuario al que pertenece la categoría)
export interface ICategory extends mongoose.Document {
  name: string;
  user: mongoose.Types.ObjectId;
}

// definir el esquema de Mongoose para la categoría, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo name es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
const categorySchema = new Schema<ICategory>(
  {
    // definir los campos del esquema de Mongoose para la categoría, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo name es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
    name: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// exportar el modelo de Mongoose para la categoría, esto permite utilizar el modelo en otras partes del proyecto para crear, leer, actualizar y eliminar documentos de categoría en la base de datos
export const Category = mongoose.model<ICategory>("Category", categorySchema);
