"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const budget_model_1 = require("../../models/budget.model");
const expense_model_1 = require("../../models/expense.model");
const getDashboard = async (userId, month) => {
    const user = new mongoose_1.default.Types.ObjectId(userId);
    const now = month && /^\d{4}-\d{2}$/.test(month) ? new Date(`${month}-01T00:00:00`) : new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthMatch = {
        date: {
            $gte: startOfMonth,
            $lt: startOfNextMonth
        },
        user
    };
    const [metrics] = await expense_model_1.Expense.aggregate([
        { $match: monthMatch },
        {
            $group: {
                _id: null,
                totalGastado: { $sum: "$amount" },
                gastoPromedio: { $avg: "$amount" },
                mayorGasto: { $max: "$amount" }
            }
        }
    ]);
    const gastosPorCategoria = await expense_model_1.Expense.aggregate([
        { $match: monthMatch },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" },
        {
            $group: {
                _id: "$category._id",
                categoria: { $first: "$category.name" },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { total: -1 } }
    ]);
    const evolucionMensual = await expense_model_1.Expense.aggregate([
        { $match: monthMatch },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                total: 1
            }
        }
    ]);
    const budget = await budget_model_1.Budget.findOne({
        month: now.getMonth() + 1,
        user,
        year: now.getFullYear()
    }).sort({ createdAt: -1 });
    const presupuestoMensual = budget?.amount || 0;
    const presupuestoDisponible = presupuestoMensual - (metrics?.totalGastado || 0);
    const presupuestoUsado = presupuestoMensual > 0 ? ((metrics?.totalGastado || 0) / presupuestoMensual) * 100 : 0;
    return {
        totalGastado: metrics?.totalGastado || 0,
        gastoPromedio: metrics?.gastoPromedio || 0,
        mayorGasto: metrics?.mayorGasto || 0,
        presupuestoDisponible,
        presupuestoMensual,
        presupuestoUsado,
        gastosPorCategoria,
        evolucionMensual
    };
};
exports.getDashboard = getDashboard;
