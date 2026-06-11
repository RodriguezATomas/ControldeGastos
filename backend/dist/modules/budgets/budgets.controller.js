"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchBudget = exports.storeBudget = exports.listBudgets = void 0;
const budgets_service_1 = require("./budgets.service");
const listBudgets = async (req, res) => {
    try {
        const budgets = await (0, budgets_service_1.getBudgets)(req.user._id.toString());
        res.json(budgets);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.listBudgets = listBudgets;
const storeBudget = async (req, res) => {
    try {
        const budget = await (0, budgets_service_1.createBudget)(req.user._id.toString(), req.body);
        res.status(201).json(budget);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.storeBudget = storeBudget;
const patchBudget = async (req, res) => {
    try {
        const budget = await (0, budgets_service_1.updateBudget)(req.user._id.toString(), req.params.id, req.body);
        res.json(budget);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.patchBudget = patchBudget;
