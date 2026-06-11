// Servicio para manejar la lógica de negocio relacionada con los objetivos de ahorro
import { Goal } from "../../models/goal.model";

// funcion para obtener los objetivos de ahorro de un usuario ----------------------------------------------------------------
export const getGoals = (userId: string) => {
  return Goal.find({ user: userId });
};

// funcion para crear un nuevo objetivo de ahorro ----------------------------------------------------------------
export const createGoal = (
  userId: string,
  data: { name: string; targetAmount: number; currentAmount?: number; deadline?: Date }
) => {
  return Goal.create({
    ...data,
    user: userId
  });
};

// funcion para actualizar un objetivo de ahorro existente ---------------------------------------------------------------- 
export const updateGoal = async (
  userId: string,
  id: string,
  data: Partial<{ name: string; targetAmount: number; currentAmount: number; deadline: Date }>
) => {
  // busca el objetivo por su id y el id del usuario para asegurarse de que solo se puedan actualizar los objetivos del usuario autenticado
  const goal = await Goal.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true
  });

  if (!goal) {
    throw new Error("Meta no encontrada");
  }

  return goal;
};

// funcion para eliminar un objetivo de ahorro existente ----------------------------------------------------------------
export const deleteGoal = async (userId: string, id: string) => {
  // elimina el objetivo por su id y el id del usuario para asegurarse de que solo se puedan eliminar los objetivos del usuario autenticado
  const goal = await Goal.findOneAndDelete({ _id: id, user: userId });

  if (!goal) {
    throw new Error("Meta no encontrada");
  }
};
