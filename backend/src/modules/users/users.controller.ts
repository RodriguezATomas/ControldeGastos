import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./users.service";

export const listUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const findUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getUserById(req.params.id as string);

    res.json(user);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const storeUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const patchUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await updateUser(req.params.id as string, req.body);

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const removeUser = async (req: AuthRequest, res: Response) => {
  try {
    await deleteUser(req.params.id as string);

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};
