"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudget = exports.createBudget = exports.getBudgets = void 0;
const budget_model_1 = require("../../models/budget.model");
const getBudgets = (userId) => {
    return budget_model_1.Budget.find({ user: userId });
};
exports.getBudgets = getBudgets;
const createBudget = (userId, data) => {
    return budget_model_1.Budget.create({
        ...data,
        user: userId
    });
};
exports.createBudget = createBudget;
const updateBudget = async (userId, id, data) => {
    const budget = await budget_model_1.Budget.findOneAndUpdate({ _id: id, user: userId }, data, {
        new: true,
        runValidators: true
    });
    if (!budget) {
        throw new Error("Presupuesto no encontrado");
    }
    return budget;
};
exports.updateBudget = updateBudget;
