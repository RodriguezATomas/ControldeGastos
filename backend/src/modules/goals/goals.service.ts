import { Goal } from "../../models/goal.model";

export const getGoals = (userId: string) => {
  return Goal.find({ user: userId });
};

export const createGoal = (
  userId: string,
  data: { name: string; targetAmount: number; currentAmount?: number; deadline?: Date }
) => {
  return Goal.create({
    ...data,
    user: userId
  });
};

export const updateGoal = async (
  userId: string,
  id: string,
  data: Partial<{ name: string; targetAmount: number; currentAmount: number; deadline: Date }>
) => {
  const goal = await Goal.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true
  });

  if (!goal) {
    throw new Error("Meta no encontrada");
  }

  return goal;
};

export const deleteGoal = async (userId: string, id: string) => {
  const goal = await Goal.findOneAndDelete({ _id: id, user: userId });

  if (!goal) {
    throw new Error("Meta no encontrada");
  }
};
