"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserEmail = exports.sendUserVerificationEmail = exports.resetUserPassword = exports.forgotUserPassword = exports.refreshUserTokens = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../../models/user.model");
const token_model_1 = require("../../models/token.model");
const accessSecret = () => process.env.JWT_ACCESS_SECRET || "access_secret";
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || "refresh_secret";
const signToken = (user, secret, expiresIn) => {
    const options = { expiresIn: expiresIn };
    return jsonwebtoken_1.default.sign({
        sub: user._id.toString(),
        email: user.email,
        role: user.role
    }, secret, options);
};
const createTokens = async (user) => {
    const accessToken = signToken(user, accessSecret(), process.env.JWT_ACCESS_EXPIRES_IN || "15m");
    const refreshToken = signToken(user, refreshSecret(), process.env.JWT_REFRESH_EXPIRES_IN || "7d");
    await token_model_1.Token.create({
        user: user._id,
        token: refreshToken
    });
    return {
        accessToken,
        refreshToken
    };
};
const registerUser = async (name, email, password) => {
    const exists = await user_model_1.User.findOne({ email });
    if (exists) {
        throw new Error("El email ya esta registrado");
    }
    const user = await user_model_1.User.create({ name, email, password });
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
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await user_model_1.User.findOne({ email });
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
exports.loginUser = loginUser;
const logoutUser = async (refreshToken) => {
    await token_model_1.Token.deleteOne({ token: refreshToken });
};
exports.logoutUser = logoutUser;
const refreshUserTokens = async (refreshToken) => {
    const storedToken = await token_model_1.Token.findOne({ token: refreshToken });
    if (!storedToken) {
        throw new Error("Refresh token invalido");
    }
    const payload = jsonwebtoken_1.default.verify(refreshToken, refreshSecret());
    const user = await user_model_1.User.findById(payload.sub);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    await token_model_1.Token.deleteOne({ token: refreshToken });
    return createTokens(user);
};
exports.refreshUserTokens = refreshUserTokens;
const forgotUserPassword = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    user.resetPasswordToken = crypto_1.default.randomBytes(32).toString("hex");
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    return {
        resetPasswordToken: user.resetPasswordToken
    };
};
exports.forgotUserPassword = forgotUserPassword;
const resetUserPassword = async (token, password) => {
    const user = await user_model_1.User.findOne({
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
exports.resetUserPassword = resetUserPassword;
const sendUserVerificationEmail = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    user.emailVerificationToken = crypto_1.default.randomBytes(32).toString("hex");
    await user.save();
    return {
        emailVerificationToken: user.emailVerificationToken
    };
};
exports.sendUserVerificationEmail = sendUserVerificationEmail;
const verifyUserEmail = async (token) => {
    const user = await user_model_1.User.findOne({ emailVerificationToken: token });
    if (!user) {
        throw new Error("Token invalido");
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
};
exports.verifyUserEmail = verifyUserEmail;
