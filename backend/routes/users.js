import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllUsers);
router.put('/:id/role', adminOnly, updateUserRole);
router.delete('/:id', adminOnly, deleteUser);

export default router;
