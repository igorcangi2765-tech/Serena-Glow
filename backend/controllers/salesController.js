import { db, uid } from '../config/db.js';

export const createSale = async (req, res) => {
  const salePayload = req.body.sale || req.body;
  const items = req.body.items || [];

  try {
    if (!items.length) return res.status(400).json({ error: 'Adicione pelo menos um servico.' });

    const id = uid();
    const timestamp = new Date().toISOString();

    db.exec('BEGIN');
    db.prepare(`
      INSERT INTO sales (id, total, payment_method, status, type, discount_amount, discount_type, customer_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      Number(salePayload.total || 0),
      salePayload.payment_method || 'Dinheiro',
      salePayload.status || 'completed',
      salePayload.type || 'pos',
      Number(salePayload.discount_amount || 0),
      salePayload.discount_type || null,
      salePayload.customer_id || null,
      timestamp
    );

    const insertItem = db.prepare(`
      INSERT INTO sale_items (id, sale_id, service_id, quantity, unit_price)
      VALUES (?, ?, ?, ?, ?)
    `);

    items.forEach((item) => {
      insertItem.run(uid(), id, item.service_id || item.id, Number(item.quantity || 1), Number(item.unit_price || item.price || 0));
    });

    if (salePayload.customer_id) {
      db.prepare(`
        UPDATE clients
        SET total_spent = total_spent + ?, last_visit = ?, updated_at = ?
        WHERE id = ?
      `).run(Number(salePayload.total || 0), timestamp, timestamp, salePayload.customer_id);
    }

    db.exec('COMMIT');
    res.status(201).json(db.prepare('SELECT * FROM sales WHERE id = ?').get(id));
  } catch (error) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: 'Erro ao processar venda', detail: error.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const sales = db.prepare(`
      SELECT s.*, c.name AS client_name, c.phone AS client_phone
      FROM sales s
      LEFT JOIN clients c ON c.id = s.customer_id
      ORDER BY s.created_at DESC
    `).all();

    const itemsStmt = db.prepare(`
      SELECT si.*, sv.name_pt, sv.name_en
      FROM sale_items si
      JOIN services sv ON sv.id = si.service_id
      WHERE si.sale_id = ?
    `);

    res.json(sales.map((sale) => ({
      ...sale,
      client: sale.customer_id ? { id: sale.customer_id, name: sale.client_name, phone: sale.client_phone } : null,
      items: itemsStmt.all(sale.id).map((item) => ({
        ...item,
        service: { id: item.service_id, name_pt: item.name_pt, name_en: item.name_en }
      }))
    })));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relatorio', detail: error.message });
  }
};
