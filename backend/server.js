import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import salesRoutes from './routes/sales.js';
import userRoutes from './routes/users.js';
import { db, uid } from './config/db.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/users', userRoutes);

app.get('/api/dashboard', authMiddleware, async (req, res, next) => {
  try {
    res.json({
      bookings: db.prepare('SELECT COUNT(*) AS total FROM appointments').get().total,
      clients: db.prepare('SELECT COUNT(*) AS total FROM clients').get().total,
      revenue: db.prepare('SELECT COALESCE(SUM(total), 0) AS total FROM sales').get().total
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard/charts', authMiddleware, async (req, res, next) => {
  try {
    const sales = db.prepare('SELECT total, created_at FROM sales ORDER BY created_at ASC LIMIT 30').all();
    const services = db.prepare(`
      SELECT sv.category AS name, COALESCE(SUM(si.quantity), 0) AS count
      FROM sale_items si
      JOIN services sv ON sv.id = si.service_id
      GROUP BY sv.category
      ORDER BY count DESC
      LIMIT 5
    `).all();

    res.json({
      revenue: sales.map((sale) => ({
        name: new Date(sale.created_at).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit' }),
        total: sale.total
      })),
      services
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/profiles', authMiddleware, async (req, res, next) => {
  try {
    const users = db.prepare('SELECT id, name, role FROM users ORDER BY name ASC').all();
    res.json(users.map((user) => ({ id: user.id, full_name: user.name, role: user.role })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/billing/documents', authMiddleware, async (req, res, next) => {
  try {
    const sales = db.prepare(`
      SELECT s.*, c.name AS client_name, c.phone AS client_phone
      FROM sales s
      LEFT JOIN clients c ON c.id = s.customer_id
      ORDER BY s.created_at DESC
    `).all();
    const itemsStmt = db.prepare(`
      SELECT si.quantity, si.unit_price, sv.name_pt
      FROM sale_items si
      JOIN services sv ON sv.id = si.service_id
      WHERE si.sale_id = ?
    `);

    res.json(sales.map((sale, index) => ({
      id: sale.id,
      doc_number: `REC-${String(index + 1).padStart(4, '0')}`,
      type: sale.status === 'pending' ? 'invoice' : 'receipt',
      created_at: sale.created_at,
      sales: {
        total: sale.total,
        payment_method: sale.payment_method,
        clients: sale.customer_id ? { id: sale.customer_id, name: sale.client_name, phone: sale.client_phone } : null,
        sale_items: itemsStmt.all(sale.id).map((item) => ({
          service_name: item.name_pt,
          price: item.unit_price,
          quantity: item.quantity
        }))
      }
    })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/gallery', async (req, res, next) => {
  try {
    const images = db.prepare('SELECT * FROM gallery_images ORDER BY created_at DESC').all();
    res.json(images.map((image) => ({ ...image, url: image.image_url })));
  } catch (error) {
    next(error);
  }
});

app.post('/api/gallery', authMiddleware, async (req, res, next) => {
  try {
    const id = uid();
    db.prepare(`
      INSERT INTO gallery_images (id, image_url, title, category, client_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, req.body.image_url || req.body.url, req.body.title || null, req.body.category || 'Geral', req.body.client_name || null, new Date().toISOString());
    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(id);
    res.status(201).json({ ...image, url: image.image_url });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/gallery/:id', authMiddleware, async (req, res, next) => {
  try {
    db.prepare('DELETE FROM gallery_images WHERE id = ?').run(req.params.id);
    res.json({ message: 'Imagem removida com sucesso' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/settings', async (req, res, next) => {
  try {
    const settings = db.prepare('SELECT * FROM salon_settings WHERE id = ?').get('main');
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.put('/api/settings', authMiddleware, async (req, res, next) => {
  try {
    const current = db.prepare('SELECT * FROM salon_settings WHERE id = ?').get('main');
    db.prepare(`
      UPDATE salon_settings
      SET name = ?, phone = ?, email = ?, address = ?, hours = ?, instagram = ?, updated_at = ?
      WHERE id = 'main'
    `).run(
      req.body.name ?? current.name,
      req.body.phone ?? current.phone,
      req.body.email ?? current.email,
      req.body.address ?? current.address,
      req.body.hours ?? current.hours,
      req.body.instagram ?? current.instagram,
      new Date().toISOString()
    );
    const settings = db.prepare('SELECT * FROM salon_settings WHERE id = ?').get('main');
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.get('/api/inbox', authMiddleware, (req, res) => {
  res.json([]);
});

app.get('/api/marketing/stats', authMiddleware, (req, res) => {
  res.json({ totalCampaigns: 0, sentMessages: 0, openRate: 0 });
});

app.get('/', (req, res) => {
  res.json({ message: 'Serena Glow API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
