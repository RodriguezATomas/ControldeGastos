// Archivo de modelo para la meta, aquí se define el esquema de Mongoose para la meta, que incluye campos como name (nombre de la meta), targetAmount (monto objetivo), currentAmount (monto actual), deadline (fecha límite) y user (referencia al usuario al que pertenece la meta), también se exporta el modelo de Mongoose para poder utilizarlo en otras partes del proyecto
import mongoose, { Schema } from "mongoose";

// definir la interfaz IGoal que extiende de mongoose.Document, esta interfaz representa la estructura de un documento de meta en la base de datos, incluye campos como name (nombre de la meta), targetAmount (monto objetivo), currentAmount (monto actual), deadline (fecha límite) y user (referencia al usuario al que pertenece la meta)
export interface IGoal extends mongoose.Document {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  user: mongoose.Types.ObjectId;
}

// definir el esquema de Mongoose para la meta, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo name es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, targetAmount es un número requerido que no puede ser negativo, currentAmount es un número requerido que no puede ser negativo y por defecto es 0, deadline es una fecha opcional y user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
const goalSchema = new Schema<IGoal>(
  {
    // definir los campos del esquema de Mongoose para la meta, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo name es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, targetAmount es un número requerido que no puede ser negativo, currentAmount es un número requerido que no puede ser negativo y por defecto es 0, deadline es una fecha opcional y user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
    name: {
      type: String,
      required: true,
      trim: true
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    deadline: {
      type: Date
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

// exportar el modelo de Mongoose para la meta, esto permite utilizar el modelo en otras partes del proyecto para crear, leer, actualizar y eliminar documentos de meta en la base de datos
export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
