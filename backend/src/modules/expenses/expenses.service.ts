// servicio para manejar la lógica de negocio relacionada con los gastos
import { Category } from "../../models/category.model";
import { Expense } from "../../models/expense.model";

export interface ExpenseFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: string;
  maxAmount?: string;
}

// funcion para obtener los gastos de un usuario con filtros opcionales ----------------------------------------------------------------
export const getExpenses = (userId: string, filters: ExpenseFilters) => {
  // construye la consulta de MongoDB en base a los filtros proporcionados por el usuario
  const query: Record<string, unknown> = { user: userId };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.dateFrom || filters.dateTo) {
    query.date = {};

    if (filters.dateFrom) {
      (query.date as Record<string, Date>).$gte = new Date(filters.dateFrom);
    }

    if (filters.dateTo) {
      (query.date as Record<string, Date>).$lte = new Date(filters.dateTo);
    }
  }

  if (filters.minAmount || filters.maxAmount) {
    query.amount = {};

    if (filters.minAmount) {
      (query.amount as Record<string, number>).$gte = Number(filters.minAmount);
    }

    if (filters.maxAmount) {
      (query.amount as Record<string, number>).$lte = Number(filters.maxAmount);
    }
  }

  return Expense.find(query).populate("category");
};

// funcion para crear un nuevo gasto ----------------------------------------------------------------
export const createExpense = async (
  userId: string,
  data: { description: string; amount: number; date?: Date; category: string; paymentMethod: string }
) => {
  // verifica que la categoria exista y pertenezca al usuario antes de crear el gasto
  const category = await Category.findOne({ _id: data.category, user: userId });

  if (!category) {
    throw new Error("Categoria no encontrada");
  }

  return Expense.create({
    ...data,
    user: userId
  });
};

// funcion para actualizar un gasto existente ----------------------------------------------------------
export const updateExpense = async (
  userId: string,
  id: string,
  data: Partial<{ description: string; amount: number; date: Date; category: string; paymentMethod: string }>
) => {
  if (data.category) {
    // verifica que la categoria exista y pertenezca al usuario antes de actualizar el gasto
    const category = await Category.findOne({ _id: data.category, user: userId });

    if (!category) {
      throw new Error("Categoria no encontrada");
    }
  }
  // actualiza el gasto y devuelve el gasto actualizado con la categoria poblada
  const expense = await Expense.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true
  }).populate("category");

  if (!expense) {
    throw new Error("Gasto no encontrado");
  }

  return expense;
};

// funcion para eliminar un gasto existente ----------------------------------------------------------
export const deleteExpense = async (userId: string, id: string) => {
  // elimina el gasto y verifica que el gasto exista y pertenezca al usuario antes de eliminarlo
  const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

  if (!expense) {
    throw new Error("Gasto no encontrado");
  }
};
