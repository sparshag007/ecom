"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/productRoutes.ts
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Product CRUD operations
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['admin']), productController_1.createProduct); // Create a new product
router.get('/', productController_1.getAllProducts); // Get all products
router.get('/search', productController_1.getProductsWithFilters); // Search and filter products
router.get('/:id', productController_1.getProductById); // Get a product by ID
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['admin']), productController_1.updateProduct); // Update a product
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['admin']), productController_1.deleteProduct); // Delete a product
exports.default = router;
