"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.sendVerificationEmail = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await (0, auth_service_1.registerUser)(name, email, password);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await (0, auth_service_1.loginUser)(email, password);
        res.json(data);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await (0, auth_service_1.logoutUser)(refreshToken);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.logout = logout;
const refreshTokens = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await (0, auth_service_1.refreshUserTokens)(refreshToken);
        res.json({ tokens });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.refreshTokens = refreshTokens;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await (0, auth_service_1.forgotUserPassword)(email);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        await (0, auth_service_1.resetUserPassword)(token, password);
        res.json({ message: "Password actualizado" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.resetPassword = resetPassword;
const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await (0, auth_service_1.sendUserVerificationEmail)(email);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        await (0, auth_service_1.verifyUserEmail)(token);
        res.json({ message: "Email verificado" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.verifyEmail = verifyEmail;
