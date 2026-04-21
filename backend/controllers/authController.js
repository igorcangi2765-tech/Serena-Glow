import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, uid } from '../config/db.js';

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email || '').trim().toLowerCase());
    if (!user) return res.status(401).json({ error: 'Credenciais invalidas' });

    const isMatch = await bcrypt.compare(password || '', user.password);
    if (!isMatch) return res.status(401).json({ error: 'Credenciais invalidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key_123',
      { expiresIn: '24h' }
    );

    res.json({ token, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor', detail: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e palavra-passe sao obrigatorios.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) return res.status(400).json({ error: 'Utilizador ja existe' });

    const id = uid();
    const hashedPassword = await bcrypt.hash(password, 10);
    const timestamp = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, hashedPassword, name, role || 'staff', timestamp, timestamp);

    res.status(201).json({ message: 'Utilizador criado com sucesso', userId: id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar utilizador', detail: error.message });
  }
};
