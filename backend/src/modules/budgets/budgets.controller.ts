// controlador para manejar las rutas relacionadas con los presupuestos
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createBudget, getBudgets, updateBudget } from "./budgets.service";

// funcion para listar los presupuestos del usuario ----------------------------------------------------------------
export const listBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const budgets = await getBudgets(req.user!._id.toString());

    res.json(budgets);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para crear un nuevo presupuesto ----------------------------------------------------------------
export const storeBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await createBudget(req.user!._id.toString(), req.body);

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para actualizar un presupuesto existente ----------------------------------------------------------
export const patchBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await updateBudget(req.user!._id.toString(), req.params.id as string, req.body);

    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
