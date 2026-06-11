"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExpense = exports.patchExpense = exports.storeExpense = exports.listExpenses = void 0;
const expenses_service_1 = require("./expenses.service");
const listExpenses = async (req, res) => {
    try {
        const expenses = await (0, expenses_service_1.getExpenses)(req.user._id.toString(), req.query);
        res.json(expenses);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.listExpenses = listExpenses;
const storeExpense = async (req, res) => {
    try {
        const expense = await (0, expenses_service_1.createExpense)(req.user._id.toString(), req.body);
        res.status(201).json(expense);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.storeExpense = storeExpense;
const patchExpense = async (req, res) => {
    try {
        const expense = await (0, expenses_service_1.updateExpense)(req.user._id.toString(), req.params.id, req.body);
        res.json(expense);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.patchExpense = patchExpense;
const removeExpense = async (req, res) => {
    try {
        await (0, expenses_service_1.deleteExpense)(req.user._id.toString(), req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.removeExpense = removeExpense;
