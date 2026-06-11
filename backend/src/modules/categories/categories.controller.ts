// controlador para manejar las solicitudes relacionadas con las categorías
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./categories.service";

// funcion para listar las categorias del usuario ----------------------------------------------------------------
export const listCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await getCategories(req.user!._id.toString());

    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para crear una nueva categoria ----------------------------------------------------------------
export const storeCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await createCategory(req.user!._id.toString(), req.body);

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para actualizar una categoria existente ----------------------------------------------------------
export const patchCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await updateCategory(req.user!._id.toString(), req.params.id as string, req.body);

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para eliminar una categoria existente ----------------------------------------------------------
export const removeCategory = async (req: AuthRequest, res: Response) => {
  try {
    await deleteCategory(req.user!._id.toString(), req.params.id as string);

    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};
