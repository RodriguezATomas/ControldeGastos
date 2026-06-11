import { User } from "../../models/user.model";

const userSelect = "-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken";

export const getUsers = () => {
  return User.find().select(userSelect);
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select(userSelect);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

export const createUser = async (data: { name: string; email: string; password: string; role?: "admin" | "user" }) => {
  const exists = await User.findOne({ email: data.email });

  if (exists) {
    throw new Error("El email ya esta registrado");
  }

  const user = await User.create(data);
  const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...userWithoutPassword } =
    user.toObject();

  return userWithoutPassword;
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; password: string; role: "admin" | "user"; isEmailVerified: boolean }>
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (data.email && data.email !== user.email) {
    const exists = await User.findOne({ email: data.email });

    if (exists) {
      throw new Error("El email ya esta registrado");
    }
  }

  Object.assign(user, data);
  await user.save();

  const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...userWithoutPassword } =
    user.toObject();

  return userWithoutPassword;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
};
