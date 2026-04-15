import express from 'express';
import { getAllClients, createClient, updateClient, getClientHistory } from '../controllers/clientController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.get('/:id/history', getClientHistory);

export default router;
