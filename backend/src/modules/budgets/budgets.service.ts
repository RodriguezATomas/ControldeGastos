// servicio para manejar la lógica de los presupuestos
import { Budget } from "../../models/budget.model";

// funcion para obtener los presupuestos de un usuario ----------------------------------------------------------------
export const getBudgets = (userId: string) => {
  return Budget.find({ user: userId });
};

// funcion para crear un nuevo presupuesto ----------------------------------------------------------------
export const createBudget = (userId: string, data: { amount: number; month: number; year: number }) => {
  return Budget.create({
    ...data,
    user: userId
  });
};

// funcion para actualizar un presupuesto existente ----------------------------------------------------------
export const updateBudget = async (
  userId: string,
  id: string,
  data: Partial<{ amount: number; month: number; year: number }>
) => {
  const budget = await Budget.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true
  });

  if (!budget) {
    throw new Error("Presupuesto no encontrado");
  }

  return budget;
};
