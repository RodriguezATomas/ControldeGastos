"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.patchUser = exports.storeUser = exports.findUser = exports.listUsers = void 0;
const users_service_1 = require("./users.service");
const listUsers = async (_req, res) => {
    try {
        const users = await (0, users_service_1.getUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.listUsers = listUsers;
const findUser = async (req, res) => {
    try {
        const user = await (0, users_service_1.getUserById)(req.params.id);
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.findUser = findUser;
const storeUser = async (req, res) => {
    try {
        const user = await (0, users_service_1.createUser)(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.storeUser = storeUser;
const patchUser = async (req, res) => {
    try {
        const user = await (0, users_service_1.updateUser)(req.params.id, req.body);
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.patchUser = patchUser;
const removeUser = async (req, res) => {
    try {
        await (0, users_service_1.deleteUser)(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.removeUser = removeUser;
