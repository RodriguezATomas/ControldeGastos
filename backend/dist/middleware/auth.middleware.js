"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Token requerido" });
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET || "access_secret");
        const user = await user_model_1.User.findById(payload.sub);
        if (!user) {
            return res.status(401).json({ message: "Usuario no autorizado" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token invalido" });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        next();
    };
};
exports.authorize = authorize;
