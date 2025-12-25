import Category from '../models/Category.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const cat = await Category.create({ name, description });
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

export const getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find({}).sort('name');
    res.json(cats);
  } catch (err) { next(err); }
};
