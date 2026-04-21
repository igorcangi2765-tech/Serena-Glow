import { db, uid } from '../config/db.js';

const formatService = (service) => ({ ...service, category_id: service.category });

export const getAllServices = async (req, res) => {
  try {
    const services = db.prepare(`
      SELECT * FROM services WHERE is_active = 1 ORDER BY category ASC, name_pt ASC
    `).all();
    res.json(services.map(formatService));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar servicos', detail: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category ASC
    `).all();
    res.json(categories.map(({ category }) => ({ id: category, name_pt: category, name_en: category })));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias', detail: error.message });
  }
};

export const createService = async (req, res) => {
  const { name_pt, name_en, description, price, duration, category, category_id } = req.body;

  try {
    if (!name_pt || price === undefined) {
      return res.status(400).json({ error: 'Nome e preco sao obrigatorios.' });
    }

    const id = uid();
    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO services (id, name_pt, name_en, description, price, duration, category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name_pt, name_en || name_pt, description || null, Number(price), Number(duration || 60), category || category_id || 'Geral', timestamp, timestamp);

    res.status(201).json(formatService(db.prepare('SELECT * FROM services WHERE id = ?').get(id)));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar servico', detail: error.message });
  }
};

export const updateService = async (req, res) => {
  const current = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Servico nao encontrado.' });

  const next = {
    name_pt: req.body.name_pt ?? current.name_pt,
    name_en: req.body.name_en ?? current.name_en,
    description: req.body.description ?? current.description,
    price: req.body.price === undefined ? current.price : Number(req.body.price),
    duration: req.body.duration === undefined ? current.duration : Number(req.body.duration),
    category: req.body.category || req.body.category_id || current.category
  };

  try {
    db.prepare(`
      UPDATE services
      SET name_pt = ?, name_en = ?, description = ?, price = ?, duration = ?, category = ?, updated_at = ?
      WHERE id = ?
    `).run(next.name_pt, next.name_en, next.description, next.price, next.duration, next.category, new Date().toISOString(), req.params.id);

    res.json(formatService(db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id)));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar servico', detail: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    db.prepare('UPDATE services SET is_active = 0, updated_at = ? WHERE id = ?').run(new Date().toISOString(), req.params.id);
    res.json({ message: 'Servico removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover servico', detail: error.message });
  }
};
