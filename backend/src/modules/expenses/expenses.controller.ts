// controlador para manejar las solicitudes relacionadas con los gastos
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "./expenses.service";

// funcion para listar los gastos del usuario ----------------------------------------------------------------
export const listExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await getExpenses(req.user!._id.toString(), req.query);

    res.json(expenses);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para crear un nuevo gasto ----------------------------------------------------------------
export const storeExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await createExpense(req.user!._id.toString(), req.body);

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para actualizar un gasto existente ----------------------------------------------------------
export const patchExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await updateExpense(req.user!._id.toString(), req.params.id as string, req.body);

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para eliminar un gasto existente ----------------------------------------------------------
export const removeExpense = async (req: AuthRequest, res: Response) => {
  try {
    await deleteExpense(req.user!._id.toString(), req.params.id as string);

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};
