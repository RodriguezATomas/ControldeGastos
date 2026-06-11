import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { IUser, User } from "../../models/user.model";
import { Token } from "../../models/token.model";

const accessSecret = () => process.env.JWT_ACCESS_SECRET || "access_secret";
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || "refresh_secret";

const signToken = (user: IUser, secret: string, expiresIn: string) => {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    },
    secret,
    options
  );
};

const createTokens = async (user: IUser) => {
  const accessToken = signToken(user, accessSecret(), process.env.JWT_ACCESS_EXPIRES_IN || "15m");
  const refreshToken = signToken(user, refreshSecret(), process.env.JWT_REFRESH_EXPIRES_IN || "7d");

  await Token.create({
    user: user._id,
    token: refreshToken
  });

  return {
    accessToken,
    refreshToken
  };
};

export const registerUser = async (name: string, email: string, password: string) => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error("El email ya esta registrado");
  }

  const user = await User.create({ name, email, password });
  const tokens = await createTokens(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    },
    tokens
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Credenciales invalidas");
  }

  const tokens = await createTokens(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    },
    tokens
  };
};

export const logoutUser = async (refreshToken: string) => {
  await Token.deleteOne({ token: refreshToken });
};

export const refreshUserTokens = async (refreshToken: string) => {
  const storedToken = await Token.findOne({ token: refreshToken });

  if (!storedToken) {
    throw new Error("Refresh token invalido");
  }

  const payload = jwt.verify(refreshToken, refreshSecret()) as jwt.JwtPayload;
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  await Token.deleteOne({ token: refreshToken });

  return createTokens(user);
};

export const forgotUserPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  return {
    resetPasswordToken: user.resetPasswordToken
  };
};

export const resetUserPassword = async (token: string, password: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new Error("Token invalido o expirado");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

export const sendUserVerificationEmail = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  user.emailVerificationToken = crypto.randomBytes(32).toString("hex");
  await user.save();

  return {
    emailVerificationToken: user.emailVerificationToken
  };
};

export const verifyUserEmail = async (token: string) => {
  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new Error("Token invalido");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
};
