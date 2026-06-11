import mongoose from "mongoose";
import { Budget } from "../../models/budget.model";
import { Expense } from "../../models/expense.model";

export const getDashboard = async (userId: string, month?: string) => {
  const user = new mongoose.Types.ObjectId(userId);
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

  const [metrics] = await Expense.aggregate([
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

  const gastosPorCategoria = await Expense.aggregate([
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

  const evolucionMensual = await Expense.aggregate([
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
  const budget = await Budget.findOne({
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
