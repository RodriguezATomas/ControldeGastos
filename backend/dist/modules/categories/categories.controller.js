"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCategory = exports.patchCategory = exports.storeCategory = exports.listCategories = void 0;
const categories_service_1 = require("./categories.service");
const listCategories = async (req, res) => {
    try {
        const categories = await (0, categories_service_1.getCategories)(req.user._id.toString());
        res.json(categories);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.listCategories = listCategories;
const storeCategory = async (req, res) => {
    try {
        const category = await (0, categories_service_1.createCategory)(req.user._id.toString(), req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.storeCategory = storeCategory;
const patchCategory = async (req, res) => {
    try {
        const category = await (0, categories_service_1.updateCategory)(req.user._id.toString(), req.params.id, req.body);
        res.json(category);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.patchCategory = patchCategory;
const removeCategory = async (req, res) => {
    try {
        await (0, categories_service_1.deleteCategory)(req.user._id.toString(), req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.removeCategory = removeCategory;
