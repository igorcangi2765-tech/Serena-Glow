import express from 'express';
import { getAllClients, createClient, updateClient, getClientHistory, verifyClient, searchClients } from '../controllers/clientController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/verify', verifyClient);

router.use(authMiddleware);

router.get('/', getAllClients);
router.get('/search', searchClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.get('/:id/history', getClientHistory);

export default router;
