import prisma from '../config/db.js';

export const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes', detail: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await prisma.client.create({
      data: req.body
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente', detail: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente', detail: error.message });
  }
};

export const getClientHistory = async (req, res) => {
  try {
    const history = await prisma.appointment.findMany({
      where: { customer_id: req.params.id },
      include: { service: true },
      orderBy: { appointment_date: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico', detail: error.message });
  }
};
