import { Router } from 'express';
import { getAverageOrderValue, getTotalSales } from '../controllers/reportController';

const router = Router();

router.get('/sales/total', getTotalSales);
router.get('/sales/aov', getAverageOrderValue);

export default router;
