"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenses = void 0;
const category_model_1 = require("../../models/category.model");
const expense_model_1 = require("../../models/expense.model");
const getExpenses = (userId, filters) => {
    const query = { user: userId };
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.dateFrom || filters.dateTo) {
        query.date = {};
        if (filters.dateFrom) {
            query.date.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
            query.date.$lte = new Date(filters.dateTo);
        }
    }
    if (filters.minAmount || filters.maxAmount) {
        query.amount = {};
        if (filters.minAmount) {
            query.amount.$gte = Number(filters.minAmount);
        }
        if (filters.maxAmount) {
            query.amount.$lte = Number(filters.maxAmount);
        }
    }
    return expense_model_1.Expense.find(query).populate("category");
};
exports.getExpenses = getExpenses;
const createExpense = async (userId, data) => {
    const category = await category_model_1.Category.findOne({ _id: data.category, user: userId });
    if (!category) {
        throw new Error("Categoria no encontrada");
    }
    return expense_model_1.Expense.create({
        ...data,
        user: userId
    });
};
exports.createExpense = createExpense;
const updateExpense = async (userId, id, data) => {
    if (data.category) {
        const category = await category_model_1.Category.findOne({ _id: data.category, user: userId });
        if (!category) {
            throw new Error("Categoria no encontrada");
        }
    }
    const expense = await expense_model_1.Expense.findOneAndUpdate({ _id: id, user: userId }, data, {
        new: true,
        runValidators: true
    }).populate("category");
    if (!expense) {
        throw new Error("Gasto no encontrado");
    }
    return expense;
};
exports.updateExpense = updateExpense;
const deleteExpense = async (userId, id) => {
    const expense = await expense_model_1.Expense.findOneAndDelete({ _id: id, user: userId });
    if (!expense) {
        throw new Error("Gasto no encontrado");
    }
};
exports.deleteExpense = deleteExpense;
