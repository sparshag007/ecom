import { Router } from 'express';
import { createOrder, updateOrder, getOrders } from '../controllers/orderController';
import { authenticateToken, authorizeRole } from '../middlewares/auth';

const router = Router();

// Create Order
router.post('/', authenticateToken, createOrder);

// Update Order
router.put('/', authenticateToken, updateOrder);

// Get Orders (for a specific user)
router.get('/:userId', authenticateToken, getOrders);

export default router;
