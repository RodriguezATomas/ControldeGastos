// servicio para manejar la lógica de negocio relacionada con las categorías
import { Category } from "../../models/category.model";

// funcion para obtener las categorías de un usuario ----------------------------------------------------------------
export const getCategories = (userId: string) => {
  return Category.find({ user: userId });
};

// funcion para crear una nueva categoria ----------------------------------------------------------------
export const createCategory = (userId: string, data: { name: string }) => {
  return Category.create({
    name: data.name,
    user: userId
  });
};

// funcion para actualizar una categoria existente ----------------------------------------------------------
export const updateCategory = async (userId: string, id: string, data: { name?: string }) => {
  const category = await Category.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true
  });

  if (!category) {
    throw new Error("Categoria no encontrada");
  }

  return category;
};

// funcion para eliminar una categoria existente ----------------------------------------------------------
export const deleteCategory = async (userId: string, id: string) => {
  const category = await Category.findOneAndDelete({ _id: id, user: userId });

  if (!category) {
    throw new Error("Categoria no encontrada");
  }
};
