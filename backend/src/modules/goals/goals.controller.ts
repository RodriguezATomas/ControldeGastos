import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createGoal, deleteGoal, getGoals, updateGoal } from "./goals.service";

export const listGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await getGoals(req.user!._id.toString());

    res.json(goals);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const storeGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await createGoal(req.user!._id.toString(), req.body);

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const patchGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await updateGoal(req.user!._id.toString(), req.params.id as string, req.body);

    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const removeGoal = async (req: AuthRequest, res: Response) => {
  try {
    await deleteGoal(req.user!._id.toString(), req.params.id as string);

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};
