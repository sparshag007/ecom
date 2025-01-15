// src/routes/reportRoutes.ts
import { Router } from 'express';
import { getTotalSales } from '../controllers/reportController';

const router = Router();

router.get('/sales/total', getTotalSales);

export default router;
