import prisma from '../config/db.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name_pt: 'asc' }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços', detail: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await prisma.service.create({
      data: req.body
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar serviço', detail: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar serviço', detail: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover serviço', detail: error.message });
  }
};
