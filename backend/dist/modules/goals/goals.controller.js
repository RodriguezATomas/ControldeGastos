"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGoal = exports.patchGoal = exports.storeGoal = exports.listGoals = void 0;
const goals_service_1 = require("./goals.service");
const listGoals = async (req, res) => {
    try {
        const goals = await (0, goals_service_1.getGoals)(req.user._id.toString());
        res.json(goals);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.listGoals = listGoals;
const storeGoal = async (req, res) => {
    try {
        const goal = await (0, goals_service_1.createGoal)(req.user._id.toString(), req.body);
        res.status(201).json(goal);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.storeGoal = storeGoal;
const patchGoal = async (req, res) => {
    try {
        const goal = await (0, goals_service_1.updateGoal)(req.user._id.toString(), req.params.id, req.body);
        res.json(goal);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.patchGoal = patchGoal;
const removeGoal = async (req, res) => {
    try {
        await (0, goals_service_1.deleteGoal)(req.user._id.toString(), req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.removeGoal = removeGoal;
