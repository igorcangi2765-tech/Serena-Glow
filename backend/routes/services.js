import express from 'express';
import { getAllServices, createService, updateService, deleteService, getCategories } from '../controllers/serviceController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllServices); // Public-ish or staff access
router.get('/categories', getCategories);
router.post('/', authMiddleware, adminOnly, createService);
router.put('/:id', authMiddleware, adminOnly, updateService);
router.delete('/:id', authMiddleware, adminOnly, deleteService);

export default router;
