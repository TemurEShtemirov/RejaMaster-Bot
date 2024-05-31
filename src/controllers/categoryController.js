import Category from "../models/category.js";

export const createCategory = async (name) => {
  const category = new Category({ name });
  await category.save();
  return category;
};

export const getCategories = async () => {
  return await Category.find();
};

export const deleteCategory = async (categoryId) => {
  return await Category.findByIdAndDelete(categoryId);
};
