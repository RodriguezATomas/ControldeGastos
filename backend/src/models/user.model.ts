// Archivo de modelo para el usuario, aquí se define el esquema de Mongoose para el usuario, que incluye campos como name (nombre del usuario), email (correo electrónico del usuario), password (contraseña del usuario), role (rol del usuario, puede ser "admin" o "user"), isEmailVerified (indica si el correo electrónico del usuario ha sido verificado), resetPasswordToken (token para restablecer la contraseña), resetPasswordExpires (fecha de expiración del token de restablecimiento de contraseña) y emailVerificationToken (token para verificar el correo electrónico), también se exporta el modelo de Mongoose para poder utilizarlo en otras partes del proyecto
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// definir la interfaz IUser que extiende de mongoose.Document, esta interfaz representa la estructura de un documento de usuario en la base de datos, incluye campos como name (nombre del usuario), email (correo electrónico del usuario), password (contraseña del usuario), role (rol del usuario, puede ser "admin" o "user"), isEmailVerified (indica si el correo electrónico del usuario ha sido verificado), resetPasswordToken (token para restablecer la contraseña), resetPasswordExpires (fecha de expiración del token de restablecimiento de contraseña) y emailVerificationToken (token para verificar el correo electrónico)
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

// definir el esquema de Mongoose para el usuario, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo name es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, email es una cadena de texto requerida que debe ser única, se convierte a minúsculas y se recorta para eliminar espacios en blanco al inicio y al final, password es una cadena de texto requerida que debe tener al menos 6 caracteres, role es una cadena de texto que puede ser "admin" o "user" y por defecto es "user", isEmailVerified es un booleano que por defecto es false, resetPasswordToken es una cadena de texto opcional, resetPasswordExpires es una fecha opcional y emailVerificationToken es una cadena de texto opcional, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
const userSchema = new Schema<IUser>(
  {
    // definir los campos del esquema de Mongoose para el usuario, se especifican los tipos de datos y las validaciones para cada campo, por ejemplo name es una cadena de texto requerida que se recorta para eliminar espacios en blanco al inicio y al final, email es una cadena de texto requerida que debe ser única, se convierte a minúsculas y se recorta para eliminar espacios en blanco al inicio y al final, password es una cadena de texto requerida que debe tener al menos 6 caracteres, role es una cadena de texto que puede ser "admin" o "user" y por defecto es "user", isEmailVerified es un booleano que por defecto es false, resetPasswordToken es una cadena de texto opcional, resetPasswordExpires es una fecha opcional y emailVerificationToken es una cadena de texto opcional, además se habilitan las marcas de tiempo para registrar la fecha de creación y actualización de cada documento
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    emailVerificationToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// definir un middleware de Mongoose que se ejecuta antes de guardar un documento de usuario, este middleware verifica si el campo password ha sido modificado, si no ha sido modificado se llama a next() para continuar con el proceso de guardado, si ha sido modificado se encripta la contraseña utilizando bcrypt con un factor de costo de 10 y luego se llama a next() para continuar con el proceso de guardado
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// definir un método de instancia para la comparación de contraseñas, este método toma una contraseña como argumento y utiliza bcrypt para comparar la contraseña proporcionada con la contraseña almacenada en el documento de usuario, devuelve una promesa que se resuelve con true si las contraseñas coinciden o false si no coinciden
userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password , this.password);
};

// exportar el modelo de Mongoose para el usuario, esto permite utilizar el modelo en otras partes del proyecto para crear, leer, actualizar y eliminar documentos de usuario en la base de datos
export const User = mongoose.model<IUser>("User", userSchema);
