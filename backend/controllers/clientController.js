import { db, uid } from '../config/db.js';

export const getAllClients = async (req, res) => {
  try {
    const clients = db.prepare('SELECT *, created_at AS createdAt FROM clients ORDER BY created_at DESC').all();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes', detail: error.message });
  }
};

export const verifyClient = async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Nome e contacto sao obrigatorios.' });

  try {
    const existing = db.prepare('SELECT * FROM clients WHERE phone = ?').get(phone);
    const timestamp = new Date().toISOString();

    if (existing) {
      db.prepare('UPDATE clients SET name = ?, email = ?, updated_at = ? WHERE id = ?').run(name, email || null, timestamp, existing.id);
      return res.json(db.prepare('SELECT * FROM clients WHERE id = ?').get(existing.id));
    }

    const id = uid();
    db.prepare(`
      INSERT INTO clients (id, name, phone, email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, phone, email || null, timestamp, timestamp);

    res.status(201).json(db.prepare('SELECT * FROM clients WHERE id = ?').get(id));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar cliente', detail: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const id = uid();
    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO clients (id, name, phone, email, notes, allergies, is_vip, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      req.body.name,
      req.body.phone,
      req.body.email || null,
      req.body.notes || null,
      req.body.allergies || null,
      req.body.is_vip ? 1 : 0,
      timestamp,
      timestamp
    );

    res.status(201).json(db.prepare('SELECT * FROM clients WHERE id = ?').get(id));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente', detail: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
    if (!current) return res.status(404).json({ error: 'Cliente nao encontrado.' });

    db.prepare(`
      UPDATE clients
      SET name = ?, phone = ?, email = ?, notes = ?, allergies = ?, is_vip = ?, updated_at = ?
      WHERE id = ?
    `).run(
      req.body.name ?? current.name,
      req.body.phone ?? current.phone,
      req.body.email ?? current.email,
      req.body.notes ?? current.notes,
      req.body.allergies ?? current.allergies,
      req.body.is_vip === undefined ? current.is_vip : (req.body.is_vip ? 1 : 0),
      new Date().toISOString(),
      req.params.id
    );

    res.json(db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente', detail: error.message });
  }
};

export const searchClients = async (req, res) => {
  const q = `%${String(req.query.q || '').trim()}%`;

  try {
    const clients = db.prepare(`
      SELECT * FROM clients
      WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
      ORDER BY name ASC
      LIMIT 10
    `).all(q, q, q);

    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao pesquisar clientes', detail: error.message });
  }
};

export const getClientHistory = async (req, res) => {
  try {
    const history = db.prepare(`
      SELECT a.*, s.name_pt, s.name_en, s.price
      FROM appointments a
      JOIN services s ON s.id = a.service_id
      WHERE a.customer_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all(req.params.id);

    res.json(history.map((item) => ({
      ...item,
      service: { name_pt: item.name_pt, name_en: item.name_en, price: item.price },
      services: { name_pt: item.name_pt, name_en: item.name_en, price: item.price }
    })));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar historico', detail: error.message });
  }
};
