// server/routes/subcategoryRoutes.js
import express from 'express';
import {
  createSubcategory,
  getSubcategoriesByCategory,
  getAllSubcategories
} from '../controllers/subcategoryController.js';

const router = express.Router();

router.get('/', getAllSubcategories); // ✅ new route
router.get('/category/:categoryId', getSubcategoriesByCategory);
router.post('/', createSubcategory);

export default router;
