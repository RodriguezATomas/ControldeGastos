// servicio de usuarios, se encarga de manejar la lógica de negocio relacionada con los usuarios, como crear, actualizar, eliminar y obtener usuarios
import { User } from "../../models/user.model";

const userSelect = "-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken";

// función que devuelve la lista de usuarios ---------------------------------------------------------------------
export const getUsers = () => {
  return User.find().select(userSelect);
};

// función que devuelve un usuario por su id ---------------------------------------------------------------------
export const getUserById = async (id: string) => {
  const user = await User.findById(id).select(userSelect);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

// función que crea un nuevo usuario ---------------------------------------------------------------------
export const createUser = async (data: { name: string; email: string; password: string; role?: "admin" | "user" }) => {
  // verificar si el email ya esta registrado
  const exists = await User.findOne({ email: data.email });

  if (exists) {
    throw new Error("El email ya esta registrado");
  }

  // crear el usuario
  const user = await User.create(data);
  // eliminar campos sensibles antes de devolver el usuario
  const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...userWithoutPassword } =
    user.toObject();

  return userWithoutPassword;
};

// función que actualiza un usuario por su id ---------------------------------------------------------------------
export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; password: string; role: "admin" | "user"; isEmailVerified: boolean }>
) => {
  // verificar si el usuario existe
  const user = await User.findById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (data.email && data.email !== user.email) {
    // verificar si el nuevo email ya esta registrado
    const exists = await User.findOne({ email: data.email });

    if (exists) {
      throw new Error("El email ya esta registrado");
    }
  }

  Object.assign(user, data);
  await user.save();

  // eliminar campos sensibles antes de devolver el usuario
  const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...userWithoutPassword } =
    user.toObject();

  return userWithoutPassword;
};

// función que elimina un usuario por su id ---------------------------------------------------------------------
export const deleteUser = async (id: string) => {
  // verificar si el usuario existe
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
};
