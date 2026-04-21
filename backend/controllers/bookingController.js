import { db, uid } from '../config/db.js';

const activeStatuses = ['pending', 'pendente', 'scheduled', 'confirmada'];

const dateOnly = (value) => String(value || '').split('T')[0];

const formatBooking = (item) => ({
  id: item.id,
  customer_id: item.customer_id,
  service_id: item.service_id,
  appointment_date: item.appointment_date,
  appointment_time: item.appointment_time,
  status: item.status,
  notes: item.notes,
  total_price: item.total_price,
  customer_name: item.client_name,
  customer_phone: item.client_phone,
  client: { id: item.customer_id, name: item.client_name, phone: item.client_phone, email: item.client_email },
  clients: { id: item.customer_id, name: item.client_name, phone: item.client_phone, email: item.client_email },
  service: { id: item.service_id, name_pt: item.service_name_pt, name_en: item.service_name_en, price: item.service_price },
  services: { id: item.service_id, name_pt: item.service_name_pt, name_en: item.service_name_en, price: item.service_price }
});

const bookingSelect = `
  SELECT
    a.*,
    c.name AS client_name,
    c.phone AS client_phone,
    c.email AS client_email,
    s.name_pt AS service_name_pt,
    s.name_en AS service_name_en,
    s.price AS service_price
  FROM appointments a
  JOIN clients c ON c.id = a.customer_id
  JOIN services s ON s.id = a.service_id
`;

export const getAllBookings = async (req, res) => {
  const { from, to } = req.query;

  try {
    let rows;
    if (from || to) {
      rows = db.prepare(`
        ${bookingSelect}
        WHERE a.appointment_date BETWEEN ? AND ?
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
      `).all(from || '0000-01-01', to || '9999-12-31');
    } else {
      rows = db.prepare(`${bookingSelect} ORDER BY a.appointment_date ASC, a.appointment_time ASC`).all();
    }

    res.json(rows.map(formatBooking));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar marcacoes', detail: error.message });
  }
};

export const createBooking = async (req, res) => {
  const { customer_id, service_id, appointment_time, status, notes } = req.body;
  const appointment_date = dateOnly(req.body.appointment_date);

  try {
    if (!customer_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Preencha cliente, servico, data e hora.' });
    }

    const service = db.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').get(service_id);
    if (!service) return res.status(404).json({ error: 'Servico nao encontrado.' });

    const existing = db.prepare(`
      SELECT id FROM appointments
      WHERE appointment_date = ? AND appointment_time = ? AND status IN (${activeStatuses.map(() => '?').join(',')})
    `).get(appointment_date, appointment_time, ...activeStatuses);

    if (existing) {
      return res.status(409).json({ error: 'Este horario ja esta ocupado. Escolha outra hora.' });
    }

    const id = uid();
    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO appointments (id, appointment_date, appointment_time, status, notes, total_price, customer_id, service_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, appointment_date, appointment_time, status || 'pendente', notes || null, Number(req.body.total_price || service.price), customer_id, service_id, timestamp, timestamp);

    db.prepare(`
      UPDATE clients
      SET total_appointments = total_appointments + 1, last_visit = ?, updated_at = ?
      WHERE id = ?
    `).run(appointment_date, timestamp, customer_id);

    const row = db.prepare(`${bookingSelect} WHERE a.id = ?`).get(id);
    res.status(201).json(formatBooking(row));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar marcacao', detail: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    db.prepare('UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?').run(
      req.body.status,
      new Date().toISOString(),
      req.params.id
    );

    const row = db.prepare(`${bookingSelect} WHERE a.id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Marcacao nao encontrada.' });

    res.json(formatBooking(row));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar marcacao', detail: error.message });
  }
};
