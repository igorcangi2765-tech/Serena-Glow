import express from 'express';
import { getAllBookings, createBooking, updateBookingStatus } from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getAllBookings);
router.post('/', createBooking); // Public can create bookings
router.patch('/:id', authMiddleware, updateBookingStatus);

export default router;
