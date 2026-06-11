"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.createGoal = exports.getGoals = void 0;
const goal_model_1 = require("../../models/goal.model");
const getGoals = (userId) => {
    return goal_model_1.Goal.find({ user: userId });
};
exports.getGoals = getGoals;
const createGoal = (userId, data) => {
    return goal_model_1.Goal.create({
        ...data,
        user: userId
    });
};
exports.createGoal = createGoal;
const updateGoal = async (userId, id, data) => {
    const goal = await goal_model_1.Goal.findOneAndUpdate({ _id: id, user: userId }, data, {
        new: true,
        runValidators: true
    });
    if (!goal) {
        throw new Error("Meta no encontrada");
    }
    return goal;
};
exports.updateGoal = updateGoal;
const deleteGoal = async (userId, id) => {
    const goal = await goal_model_1.Goal.findOneAndDelete({ _id: id, user: userId });
    if (!goal) {
        throw new Error("Meta no encontrada");
    }
};
exports.deleteGoal = deleteGoal;
