import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Stable UUIDs for Packages to ensure frontend consistency
const PACKAGE_IDS = {
  ESSENCIAL: '00000000-0000-0000-0000-000000000001',
  COMPLETA: '00000000-0000-0000-0000-000000000002',
  PREMIUM: '00000000-0000-0000-0000-000000000003'
};

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Missing Supabase credentials in environment.');
  console.log('Detected VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'MISSING');
  console.log('Detected SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'MISSING');
  console.log('Detected VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'MISSING');
} else {
  console.log('Supabase check: OK');
  console.log('Supabase URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Define a helper type for async request handlers
type AsyncHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncHandler) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const resolveCategoryId = async (categoryName: string) => {
  const { data: catData } = await supabase
    .from('service_categories')
    .select('id')
    .ilike('name_pt', categoryName)
    .limit(1);
    
  if (catData && catData.length > 0) return catData[0].id;
  
  const { data: fallbackData } = await supabase.from('service_categories').select('id').limit(1);
  return fallbackData && fallbackData.length > 0 ? fallbackData[0].id : null;
};

// --- ROUTES ---

// Health Check / Welcome
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Serena Glow Backend API is running',
    version: '1.0.0',
    endpoints: [
      '/api/clients',
      '/api/services',
      '/api/bookings',
      '/api/dashboard',
      '/api/profiles'
    ]
  });
});

app.get('/api/profiles', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('id, full_name, role').order('full_name');
  if (error) throw error;
  res.json(data);
}));

// Clients
app.get('/api/clients', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('clients').select('*').order('name');
  if (error) throw error;
  res.json(data);
}));

app.post('/api/clients', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('clients').insert([req.body]).select().single();
  if (error) throw error;
  res.json(data);
}));

app.get('/api/clients/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
    .limit(10);
  if (error) throw error;
  res.json(data);
}));

app.put('/api/clients/:id', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('clients').update(req.body).eq('id', req.params.id).select().single();
  if (error) throw error;
  res.json(data);
}));

app.get('/api/clients/:id/history', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, services(name_pt, name_en)')
    .eq('customer_id', req.params.id)
    .order('appointment_date', { ascending: false });
  
  if (error) throw error;
  res.json(data);
}));

// Services
app.get('/api/services', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      category_name:service_categories(id, name_pt, name_en)
    `)
    .order('name_pt');
  
  if (error) throw error;

  const transformedData = data?.map(s => {
    const cat = s.category_name as any;
    return {
      ...s,
      category: cat ? {
        id: cat.id,
        name_pt: cat.name_pt,
        name_en: cat.name_en || cat.name_pt
      } : { name_pt: 'Geral', name_en: 'General' }
    };
  });

  res.json(transformedData);
}));

app.get('/api/services/categories', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('service_categories').select('*').order('name_pt');
  if (error) throw error;
  res.json(data);
}));

app.post('/api/services', asyncHandler(async (req, res) => {
  const serviceData = { ...req.body };
  if (serviceData.category) {
    serviceData.category_id = await resolveCategoryId(serviceData.category);
    delete serviceData.category;
  }
  const { data, error } = await supabase.from('services').insert([serviceData]).select().single();
  if (error) throw error;
  res.json(data);
}));

app.put('/api/services/:id', asyncHandler(async (req, res) => {
  const serviceData = { ...req.body };
  if (serviceData.category) {
    serviceData.category_id = await resolveCategoryId(serviceData.category);
    delete serviceData.category;
  }
  const { data, error } = await supabase.from('services').update(serviceData).eq('id', req.params.id).select().single();
  if (error) throw error;
  res.json(data);
}));

app.delete('/api/services/:id', asyncHandler(async (req, res) => {
  const { error } = await supabase.from('services').delete().eq('id', req.params.id);
  if (error) throw error;
  res.json({ success: true });
}));

// Bookings
app.get('/api/bookings', asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  console.log('GET /api/bookings', { from, to });
  
  let query = supabase
    .from('appointments')
    .select(`
      *,
      services:service_id (id, name_pt, name_en, price),
      clients:customer_id (id, name, phone, email)
    `)
    .order('appointment_date', { ascending: true });
  
  if (from) query = query.gte('appointment_date', from as string);
  if (to) query = query.lte('appointment_date', to as string);

  const { data, error } = await query;
  if (error) throw error;
  res.json(data);
}));

app.post('/api/bookings', asyncHandler(async (req, res) => {
  console.log('📦 Novo booking (Backend):', JSON.stringify(req.body, null, 2));
  
  // Basic validation
  if (!req.body.service_id || !req.body.customer_id) {
    console.error('❌ Booking validation failed: missing IDs');
    return res.status(400).json({ error: 'service_id e customer_id são necessários' });
  }

  const { data, error } = await supabase.from('appointments').insert([req.body]).select().single();
  
  if (error) {
    console.error('❌ Error saving to Supabase:', error);
    throw error;
  }
  
  console.log('✅ Booking salvo com sucesso!');
  res.json({ message: 'Booking processado', data });
}));

app.patch('/api/bookings/:id', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('appointments').update(req.body).eq('id', req.params.id).select().single();
  if (error) throw error;
  res.json(data);
}));

// Dashboard Stats
app.get('/api/dashboard', asyncHandler(async (req, res) => {
  const [salesResult, apptsResult, clientsResult] = await Promise.all([
    supabase.from('sales').select('total'),
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
    supabase.from('clients').select('id', { count: 'exact', head: true })
  ]);
  
  if (salesResult.error) throw salesResult.error;
  if (apptsResult.error) throw apptsResult.error;
  if (clientsResult.error) throw clientsResult.error;

  const revenue = salesResult.data?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
  
  res.json({
    revenue,
    bookings: apptsResult.count || 0,
    clients: clientsResult.count || 0,
    revenueChange: 0,
    bookingsChange: 0,
    clientsChange: 0,
    conversion: 0
  });
}));

app.get('/api/dashboard/charts', asyncHandler(async (req, res) => {
  const { data: sales } = await supabase.from('sales').select('total, created_at').order('created_at', { ascending: true });
  
  const revenueByMonth = sales?.reduce((acc: any[], sale) => {
    const month = new Date(sale.created_at).toLocaleString('default', { month: 'short' });
    const existing = acc.find(m => m.name === month);
    if (existing) existing.total += sale.total;
    else acc.push({ name: month, total: sale.total });
    return acc;
  }, []) || [];

  const { data: popular } = await supabase.from('sale_items').select('quantity, service_id, services(name_pt)');
  
  const servicePopularity = popular?.reduce((acc: any[], item: any) => {
    const name = item.services?.name_pt || 'Outro';
    const existing = acc.find(s => s.name === name);
    if (existing) existing.value += item.quantity;
    else acc.push({ name, value: item.quantity });
    return acc;
  }, []) || [];

  res.json({
    revenue: revenueByMonth,
    popular: servicePopularity
  });
}));

app.get('/api/dashboard/activity', asyncHandler(async (req, res) => {
  const [salesRes, apptsRes, notificationsRes, inboxData] = await Promise.all([
    supabase.from('sales').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('appointments').select('*, services(name_pt), clients(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('inbox').select('*, created_at').order('created_at', { ascending: false }).limit(5)
  ]);

  const combinedActivity = [
    ...(salesRes.data || []).map(s => ({ ...s, activityType: 'sale' })),
    ...(apptsRes.data || []).map(a => ({ ...a, activityType: 'appointment' })),
    ...(notificationsRes.data || []).map(n => ({ ...n, activityType: 'notification' })),
    ...(inboxData.data || []).map(i => ({ ...i, activityType: 'message', customer_name: i.name }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
   .slice(0, 10);
  
  res.json(combinedActivity);
}));

app.get('/api/billing/documents', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('documents').select('*, sales(total, customer_id, clients(name))').order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data);
}));

app.get('/api/internal/setup-gallery', async (req, res) => {
  try {
    // 1. Create table if not exists (using RPC or just trying to insert)
    // In Supabase client, we can't run raw SQL directly without RPC.
    // So we'll just try to insert. If it fails with "not found", we'll know.
    const images = [
      { image_url: 'https://images.unsplash.com/photo-1560869713-7d0a20078f4a', category: 'Cabelo', client_name: 'Serena Glow Sample' },
      { image_url: 'https://images.unsplash.com/photo-1604654894610-df490982570d', category: 'Unhas', client_name: 'Serena Glow Sample' },
      { image_url: 'https://images.unsplash.com/photo-1481325544412-f043697a22ad', category: 'Maquilhagem', client_name: 'Serena Glow Sample' },
      { image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da', category: 'Estúdio', client_name: 'Serena Glow Sample' }
    ];

    const { data, error } = await supabase.from('gallery').insert(images).select();
    
    if (error) {
       console.error('Setup error:', error);
       return res.status(500).json({ error: error.message, detail: 'If table missing, it must be created in Supabase Dashboard' });
    }
    
    res.json({ message: 'Gallery seeded successfully', data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const DEFAULT_IMAGES = [
  { image_url: '/images/gallery_ai_interior.png', category: 'Estúdio', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_nails.png', category: 'Unhas', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_makeup.png', category: 'Maquilhagem', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_facial.png', category: 'Facial', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_hair.png', category: 'Cabelo', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_pedicure.png', category: 'Unhas', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_skincare.png', category: 'Facial', client_name: 'Serena Glow Studio' },
  { image_url: '/images/gallery_ai_eyelashes.png', category: 'Sobrancelhas', client_name: 'Serena Glow Studio' }
];

// Gallery
app.get('/api/gallery', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error || !data || data.length === 0) {
    return res.json(DEFAULT_IMAGES);
  }
  
  res.json(data);
}));

app.post('/api/gallery', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('gallery')
    .insert([req.body])
    .select()
    .single();
  
  if (error) throw error;
  res.json(data);
}));

app.delete('/api/gallery/:id', asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', req.params.id);
  
  if (error) throw error;
  res.json({ message: 'Imagem eliminada' });
}));

// Sales & POS
app.post('/api/sales', asyncHandler(async (req, res) => {
  const { sale, items } = req.body;
  // 1. Create Sale
  const { data: newSale, error: saleError } = await supabase
    .from('sales')
    .insert([sale])
    .select()
    .single();
  
  if (saleError) throw saleError;

  // 2. Create Sale Items
  const saleItems = items.map((item: any) => ({
    sale_id: newSale.id,
    service_id: item.service_id,
    quantity: item.quantity,
    unit_price: item.unit_price
  }));

  const { error: itemsError } = await supabase.from('sale_items').insert(saleItems);
  if (itemsError) throw itemsError;

  // 3. Generate Invoice Record
  const docNumber = `REC-${Date.now().toString().slice(-6)}`;
  await supabase.from('documents').insert({
    sale_id: newSale.id,
    doc_number: docNumber,
    type: 'receipt',
    metadata: { items: items.map((i: any) => i.name) }
  });

  // 4. Update Client Stats (if client_id is present)
  if (sale.customer_id) {
    const { data: client } = await supabase.from('clients').select('total_spent, total_appointments').eq('id', sale.customer_id).single();
    if (client) {
      await supabase.from('clients').update({
        total_spent: (client.total_spent || 0) + (sale.total || 0),
        total_appointments: (client.total_appointments || 0) + 1,
        last_visit: new Date().toISOString()
      }).eq('id', sale.customer_id);
    }
  }

  res.json(newSale);
}));

// Inbox Routes
app.get('/api/inbox', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('inbox')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data);
}));

app.post('/api/inbox', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('inbox')
    .insert([req.body])
    .select()
    .single();
  if (error) throw error;
  res.json(data);
}));

app.put('/api/inbox/:id', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('inbox')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) throw error;
  res.json(data);
}));

app.delete('/api/inbox/:id', asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('inbox')
    .delete()
    .eq('id', req.params.id);
  if (error) throw error;
  res.json({ message: 'Deleted' });
}));

// Marketing/Campaigns Routes
app.get('/api/marketing/stats', asyncHandler(async (req, res) => {
  const [comms, camps, clientsCount] = await Promise.all([
    supabase.from('communications').select('*'),
    supabase.from('campaigns').select('*'),
    supabase.from('clients').select('*', { count: 'exact', head: true })
  ]);
  if (comms.error) throw comms.error;
  if (camps.error) throw camps.error;
  if (clientsCount.error) throw clientsCount.error;

  res.json({
    communications: comms.data,
    campaigns: camps.data,
    clientCount: clientsCount.count || 0
  });
}));

app.post('/api/marketing/campaigns', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([req.body])
    .select()
    .single();
  if (error) throw error;
  res.json(data);
}));

// Settings Routes
app.get('/api/settings', asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error && error.code === 'PGRST116') {
      return res.json({
        name: 'Serena Glow',
        phone: '+258 84 000 0000',
        email: 'contacto@serenaglow.co.mz',
        address: 'Lichinga, Moçambique',
        instagram: '@serenaglow',
        nif: ''
      });
    }
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    // If table doesn't exist, fallback to defaults
    res.json({
      name: 'Serena Glow',
      phone: '+258 84 000 0000',
      email: 'contacto@serenaglow.co.mz',
      address: 'Lichinga, Moçambique',
      instagram: '@serenaglow',
      nif: ''
    });
  }
}));

app.post('/api/settings', asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...req.body }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}));

// Client Verify (Booking Flow)
app.post('/api/clients/verify', asyncHandler(async (req, res) => {
  console.log('Verificando Cliente:', req.body);
  const { phone, name, email } = req.body;
  
  const { data: existing, error: findError } = await supabase
    .from('clients')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();
  
  if (findError) throw findError;
  
  if (existing) {
    console.log('Cliente já existe:', existing.id);
    return res.json(existing);
  }
  
  console.log('Criando novo cliente...');
  const { data: created, error: createError } = await supabase
    .from('clients')
    .insert([{ name, phone, email }])
    .select()
    .single();
  
  if (createError) throw createError;
  res.json(created);
}));

// --- PRODUCTION SETUP ---
// Support both structured (dist/) and flat (public_html/) deployments
let distPath = path.join(__dirname, '../dist');

// If ../dist doesn't exist, we assume the files were moved to the root (public_html)
if (!fs.existsSync(distPath)) {
  distPath = path.join(__dirname, '..');
  console.log('Dist folder not found, falling back to root path:', distPath);
}

console.log('Runtime __dirname:', __dirname);
console.log('Final static files path:', distPath);

if (fs.existsSync(distPath)) {
  console.log('Static directory found: YES');
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    console.log('index.html found: YES');
  } else {
    console.warn('index.html MISSING in expected path:', distPath);
  }
} else {
  console.error('Static directory NOT FOUND at:', distPath);
}

app.use(express.static(distPath));

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Backend Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    status
  });
});

// Catch-all route for SPA history API fallback
app.get('*', (req, res) => {
  const targetIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(targetIndex)) {
     res.sendFile(targetIndex);
  } else {
     res.status(404).send('Serena Glow: dist/index.html not found. Deployment structure issue.');
  }
});

const server = app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  
  // Seed Packages if missing
  try {
    const { data: categories } = await supabase.from('service_categories').select('id').limit(1);
    const defaultCatId = categories?.[0]?.id;

    if (defaultCatId) {
      const packages = [
        { id: PACKAGE_IDS.ESSENCIAL, name_pt: 'Essencial', name_en: 'Essential', price: 1500, category_id: defaultCatId },
        { id: PACKAGE_IDS.COMPLETA, name_pt: 'Beleza Completa', name_en: 'Complete Beauty', price: 2500, category_id: defaultCatId },
        { id: PACKAGE_IDS.PREMIUM, name_pt: 'Beleza Premium', name_en: 'Premium Beauty', price: 4000, category_id: defaultCatId }
      ];

      for (const p of packages) {
        await supabase.from('services').upsert(p, { onConflict: 'id' });
      }
      console.log('✅ Packages seeded/verified');
    }
  } catch (err) {
    console.warn('Seeding warning:', err);
  }
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
