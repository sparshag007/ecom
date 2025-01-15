// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsWithFilters,
} from '../controllers/productController';
import { authenticateToken, authorizeRole } from '../middlewares/auth';

const router = Router();

// Product CRUD operations
router.post('/', authenticateToken, authorizeRole(['admin']), createProduct); // Create a new product
router.get('/', getAllProducts); // Get all products
router.get('/search', getProductsWithFilters); // Search and filter products
router.get('/:id', getProductById); // Get a product by ID
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateProduct); // Update a product
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteProduct); // Delete a product

export default router;
