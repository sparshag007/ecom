"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orderRoutes.ts
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Create Order
router.post('/', auth_1.authenticateToken, orderController_1.createOrder);
// Update Order
router.put('/', auth_1.authenticateToken, orderController_1.updateOrder);
// Get Orders (for a specific user)
router.get('/:userId', auth_1.authenticateToken, orderController_1.getOrders);
exports.default = router;
