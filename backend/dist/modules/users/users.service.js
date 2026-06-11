"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const user_model_1 = require("../../models/user.model");
const userSelect = "-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken";
const getUsers = () => {
    return user_model_1.User.find().select(userSelect);
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    const user = await user_model_1.User.findById(id).select(userSelect);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    const exists = await user_model_1.User.findOne({ email: data.email });
    if (exists) {
        throw new Error("El email ya esta registrado");
    }
    const user = await user_model_1.User.create(data);
    const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    if (data.email && data.email !== user.email) {
        const exists = await user_model_1.User.findOne({ email: data.email });
        if (exists) {
            throw new Error("El email ya esta registrado");
        }
    }
    Object.assign(user, data);
    await user.save();
    const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const user = await user_model_1.User.findByIdAndDelete(id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
};
exports.deleteUser = deleteUser;
