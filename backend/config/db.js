import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

const dbPath = process.env.SQLITE_PATH || './serena-glow.sqlite';
export const db = new DatabaseSync(dbPath);

export const uid = () => randomUUID();

const now = () => new Date().toISOString();

const run = (sql) => db.exec(sql);

run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    notes TEXT,
    allergies TEXT,
    is_vip INTEGER NOT NULL DEFAULT 0,
    total_spent REAL NOT NULL DEFAULT 0,
    total_appointments INTEGER NOT NULL DEFAULT 0,
    last_visit TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name_pt TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    category TEXT NOT NULL DEFAULT 'Geral',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    notes TEXT,
    total_price REAL NOT NULL DEFAULT 0,
    customer_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES clients(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Dinheiro',
    status TEXT NOT NULL DEFAULT 'completed',
    type TEXT NOT NULL DEFAULT 'pos',
    discount_amount REAL NOT NULL DEFAULT 0,
    discount_type TEXT,
    customer_id TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id TEXT PRIMARY KEY,
    sale_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    category TEXT NOT NULL DEFAULT 'Geral',
    client_name TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS salon_settings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    hours TEXT NOT NULL,
    instagram TEXT,
    updated_at TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_services_name_pt ON services(name_pt);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_url ON gallery_images(image_url);
`);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, name, role, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertUser.run(
  uid(),
  'serena',
  bcrypt.hashSync('admin123', 10),
  'Serena Glow Admin',
  'admin',
  now(),
  now()
);

const insertService = db.prepare(`
  INSERT OR IGNORE INTO services (id, name_pt, name_en, description, price, duration, category, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

[
  ['Trancas simples', 'Simple braids', 'Trancas femininas com acabamento cuidado.', 1500, 120, 'Cabelo'],
  ['Aplicacao de peruca', 'Wig installation', 'Aplicacao e alinhamento de peruca.', 2000, 90, 'Cabelo'],
  ['Tratamento capilar', 'Hair treatment', 'Hidratacao e cuidado do cabelo.', 1200, 60, 'Cabelo'],
  ['Lavagem e escova', 'Wash and blow-dry', 'Lavagem, secagem e finalizacao.', 800, 45, 'Cabelo'],
  ['Corte feminino', 'Women haircut', 'Corte simples e acabamento.', 700, 45, 'Cabelo'],
  ['Manicure', 'Manicure', 'Cuidado completo das unhas das maos.', 600, 45, 'Unhas'],
  ['Pedicure', 'Pedicure', 'Cuidado completo dos pes.', 700, 50, 'Unhas'],
  ['Unhas de gel', 'Gel nails', 'Aplicacao de gel com acabamento brilhante.', 1300, 75, 'Unhas'],
  ['Limpeza facial', 'Facial cleansing', 'Limpeza e cuidado suave do rosto.', 1500, 60, 'Rosto'],
  ['Maquilhagem simples', 'Simple makeup', 'Maquilhagem para dia, eventos e fotos.', 1800, 60, 'Rosto'],
  ['Massagem relaxante', 'Relaxing massage', 'Massagem para aliviar tensao e relaxar.', 2000, 60, 'Extras'],
  ['Cuidados especiais', 'Special care', 'Atendimento personalizado conforme necessidade.', 1000, 45, 'Extras']
].forEach(([namePt, nameEn, description, price, duration, category]) => {
  insertService.run(uid(), namePt, nameEn, description, price, duration, category, now(), now());
});

const insertImage = db.prepare(`
  INSERT OR IGNORE INTO gallery_images (id, image_url, title, category, client_name, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

[
  ['/images/gallery_ai_interior.png', 'Espaco Serena Glow', 'Salao', 'Serena Glow'],
  ['/images/gallery_ai_hair.png', 'Cabelo cuidado', 'Cabelo', 'Cliente Serena'],
  ['/images/gallery_ai_nails.png', 'Unhas de gel', 'Unhas', 'Cliente Serena'],
  ['/images/gallery_ai_makeup.png', 'Maquilhagem', 'Rosto', 'Cliente Serena']
].forEach(([url, title, category, clientName]) => {
  insertImage.run(uid(), url, title, category, clientName, now());
});

db.prepare(`
  INSERT OR IGNORE INTO salon_settings (id, name, phone, email, address, hours, instagram, updated_at)
  VALUES ('main', 'Serena Glow | Beauty Salon', '+258 84 000 0000', 'contacto@serenaglow.co.mz', 'Lichinga, Niassa, Mocambique', 'Segunda a Sabado: 08h00 - 18h00', '@serenaglow', ?)
`).run(now());

export default db;
