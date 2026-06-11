// Archivo de modelo para el gasto, aquí se define el esquema de Mongoose para el gasto, que incluye campos como description (descripción del gasto), amount (monto del gasto), date (fecha del gasto), category (referencia a la categoría del gasto), paymentMethod (método de pago utilizado) y user (referencia al usuario al que pertenece el gasto), también se exporta el modelo de Mongoose para poder utilizarlo en otras partes del proyecto
import mongoose, { Schema } from "mongoose";

// definir la interfaz IExpense que extiende de mongoose.Document, esta interfaz representa la estructura de un documento de gasto en la base de datos, incluye campos como description (descripción del gasto), amount (monto del gasto), date (fecha del gasto), category (referencia a la categoría del gasto), paymentMethod (método de pago utilizado) y user (referencia al usuario al que pertenece el gasto)
export interface IExpense extends mongoose.Document {
  description: string;
  amount: number;
  date: Date;
  category: mongoose.Types.ObjectId;
  paymentMethod: string;
  user: mongoose.Types.ObjectId;
}

// definir el esquema de Mongoose para el gasto, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo description es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, amount es un número requerido que no puede ser negativo, date es una fecha requerida que por defecto es la fecha actual, category es una referencia a un documento de categoría que también es requerido, paymentMethod es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
const expenseSchema = new Schema<IExpense>(
  {
    // definir los campos del esquema de Mongoose para el gasto, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo description es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, amount es un número requerido que no puede ser negativo, date es una fecha requerida que por defecto es la fecha actual, category es una referencia a un documento de categoría que también es requerido, paymentMethod es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, user es una referencia a un documento de usuario que también es requerido, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
    description: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    paymentMethod: {
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

// exportar el modelo de Mongoose para el gasto, esto permite utilizar el modelo en otras partes del proyecto para crear, leer, actualizar y eliminar documentos de gasto en la base de datos
export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
