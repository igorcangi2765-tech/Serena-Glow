import { db } from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, email, role, created_at AS createdAt
      FROM users
      ORDER BY name ASC
    `).all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar equipa', detail: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    db.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?').run(role, new Date().toISOString(), req.params.id);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar papel', detail: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ message: 'Profissional removido' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover profissional', detail: error.message });
  }
};
