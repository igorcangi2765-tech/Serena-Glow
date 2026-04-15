import express from 'express';
import { createSale, getSalesReport } from '../controllers/salesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createSale);
router.get('/report', getSalesReport);

export default router;
