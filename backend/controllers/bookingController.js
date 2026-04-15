import prisma from '../config/db.js';

export const getAllBookings = async (req, res) => {
  const { from, to } = req.query;
  try {
    const where = {};
    if (from || to) {
      where.appointment_date = {};
      if (from) where.appointment_date.gte = new Date(from);
      if (to) where.appointment_date.lte = new Date(to);
    }

    const bookings = await prisma.appointment.findMany({
      where,
      include: {
        client: true,
        service: true
      },
      orderBy: { appointment_date: 'asc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar marcações', detail: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await prisma.appointment.create({
      data: req.body,
      include: {
        client: true,
        service: true
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar marcação', detail: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar marcação', detail: error.message });
  }
};
