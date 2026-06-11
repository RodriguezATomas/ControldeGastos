import { Category } from "../../models/category.model";

export const getCategories = (userId: string) => {
  return Category.find({ user: userId });
};

export const createCategory = (userId: string, data: { name: string }) => {
  return Category.create({
    name: data.name,
    user: userId
  });
};

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

export const deleteCategory = async (userId: string, id: string) => {
  const category = await Category.findOneAndDelete({ _id: id, user: userId });

  if (!category) {
    throw new Error("Categoria no encontrada");
  }
};
