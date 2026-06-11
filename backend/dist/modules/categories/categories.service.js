"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const category_model_1 = require("../../models/category.model");
const getCategories = (userId) => {
    return category_model_1.Category.find({ user: userId });
};
exports.getCategories = getCategories;
const createCategory = (userId, data) => {
    return category_model_1.Category.create({
        name: data.name,
        user: userId
    });
};
exports.createCategory = createCategory;
const updateCategory = async (userId, id, data) => {
    const category = await category_model_1.Category.findOneAndUpdate({ _id: id, user: userId }, data, {
        new: true,
        runValidators: true
    });
    if (!category) {
        throw new Error("Categoria no encontrada");
    }
    return category;
};
exports.updateCategory = updateCategory;
const deleteCategory = async (userId, id) => {
    const category = await category_model_1.Category.findOneAndDelete({ _id: id, user: userId });
    if (!category) {
        throw new Error("Categoria no encontrada");
    }
};
exports.deleteCategory = deleteCategory;
