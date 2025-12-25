import Subcategory from "../models/SubCategory.js";

// ✅ Create Subcategory
export const createSubcategory = async (req, res, next) => {
  try {
    const { categoryId, name, description } = req.body;
    if (!categoryId || !name) {
      return res.status(400).json({ message: "categoryId & name required" });
    }

    const subcategory = await Subcategory.create({ categoryId, name, description });
    res.status(201).json(subcategory);
  } catch (err) {
    next(err);
  }
};

// ✅ Get ALL Subcategories
export const getAllSubcategories = async (req, res, next) => {
  try {
    const subcategories = await Subcategory.find().populate("categoryId", "name");
    res.json(subcategories);
  } catch (err) {
    next(err);
  }
};

// ✅ Get Subcategories by Category
export const getSubcategoriesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ categoryId });
    res.json(subcategories);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete Subcategory
export const deleteSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    next(err);
  }
};
