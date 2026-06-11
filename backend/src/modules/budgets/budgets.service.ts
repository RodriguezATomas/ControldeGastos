import { Budget } from "../../models/budget.model";

export const getBudgets = (userId: string) => {
  return Budget.find({ user: userId });
};

export const createBudget = (userId: string, data: { amount: number; month: number; year: number }) => {
  return Budget.create({
    ...data,
    user: userId
  });
};

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
