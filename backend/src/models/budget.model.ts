// Archivo de modelo para el presupuesto, aquí se define el esquema de Mongoose para el presupuesto, que incluye campos como amount (monto del presupuesto), month (mes al que corresponde el presupuesto), year (año al que corresponde el presupuesto) y user (referencia al usuario al que pertenece el presupuesto), también se exporta el modelo de Mongoose para poder utilizarlo en otras partes del proyecto
import mongoose, { Schema } from "mongoose";

// definir la interfaz IBudget que extiende de mongoose.Document, esta interfaz representa la estructura de un documento de presupuesto en la base de datos, incluye campos como amount (monto del presupuesto), month (mes al que corresponde el presupuesto), year (año al que corresponde el presupuesto) y user (referencia al usuario al que pertenece el presupuesto)
export interface IBudget extends mongoose.Document {
  amount: number;
  month: number;
  year: number;
  user: mongoose.Types.ObjectId;
}

// definir el esquema de Mongoose para el presupuesto, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo amount es un número requerido que no puede ser negativo, month es un número requerido que debe estar entre 1 y 12, year es un número requerido y user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
const budgetSchema = new Schema<IBudget>(
  {
    // definir los campos del esquema de Mongoose para el presupuesto, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo amount es un número requerido que no puede ser negativo, month es un número requerido que debe estar entre 1 y 12, year es un número requerido y user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
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

// exportar el modelo de Mongoose para el presupuesto, esto permite utilizar el modelo en otras partes del proyecto para crear, leer, actualizar y eliminar documentos de presupuesto en la base de datos
export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
