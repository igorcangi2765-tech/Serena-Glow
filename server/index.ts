import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

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

// --- PRODUCTION SETUP ---
// Support both structured (dist/) and flat (public_html/) deployments
import fs from 'fs';
const rootPath = path.join(__dirname, '..');
let distPath = path.join(rootPath, 'dist');
const publicImagesPath = path.join(rootPath, 'public/images');

// Log paths for debugging in production logs
console.log('Runtime __dirname:', __dirname);

// If dist doesn't exist, we assume the files were moved to the root (public_html)
if (!fs.existsSync(distPath)) {
  distPath = rootPath;
  console.log('Dist folder not found, falling back to root path:', distPath);
}

console.log('Final static files path:', distPath);

// Regular static serving
app.use(express.static(distPath));

// EXPLICIT IMAGE FALLBACK:
// If dist/images is missing, serve from public/images
const distImagesPath = path.join(distPath, 'images');
if (!fs.existsSync(distImagesPath) && fs.existsSync(publicImagesPath)) {
  console.log('Explicitly serving /images from fallback public folder');
  app.use('/images', express.static(publicImagesPath));
} else {
  // Always serve images folder if it exists in dist
  app.use('/images', express.static(distImagesPath));
}

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

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Serena Glow Backend API is running',
    version: '1.0.0'
  });
});

app.get('/api/profiles', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('id, full_name, role').order('full_name');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clients
app.get('/api/clients', async (req, res) => {
  try {
    const { data, error } = await supabase.from('clients').select('*').order('name');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { data, error } = await supabase.from('clients').insert([req.body]).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/search', async (req, res) => {
  const { q } = req.query;
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
      .limit(10);
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('clients').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, services(name_pt, name_en)')
      .eq('customer_id', req.params.id)
      .order('appointment_date', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Services
const MOCK_SERVICES = [
  { id: '1', name_pt: 'Limpeza de Pele', name_en: 'Facial Cleansing', price: 1500, category_id: 'Facial', category: { name_pt: 'Facial', name_en: 'Facial' } },
  { id: '2', name_pt: 'Manicure', name_en: 'Manicure', price: 800, category_id: 'Nails', category: { name_pt: 'Unhas', name_en: 'Nails' } },
  { id: '3', name_pt: 'Maquilhagem', name_en: 'Makeup', price: 2500, category_id: 'Makeup', category: { name_pt: 'Maquilhagem', name_en: 'Makeup' } }
];

app.get('/api/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        category_name:service_categories(id, name_pt, name_en)
      `)
      .order('name_pt');
    
    if (error || !data || data.length === 0) {
      console.warn('Returning MOCK_SERVICES due to empty DB or error');
      return res.json(MOCK_SERVICES);
    }

    // Transform to maintain frontend compatibility
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
  } catch (err: any) {
    console.error('API Error /services, returning mocks:', err.message);
    res.json(MOCK_SERVICES);
  }
});

app.get('/api/services/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('service_categories').select('*').order('name_pt');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (serviceData.category) {
      const { data: catData } = await supabase.from('service_categories').select('id').ilike('name_pt', serviceData.category).limit(1);
      if (catData && catData.length > 0) {
        serviceData.category_id = catData[0].id;
      } else {
        const { data: fallbackData } = await supabase.from('service_categories').select('id').limit(1);
        if (fallbackData && fallbackData.length > 0) serviceData.category_id = fallbackData[0].id;
      }
      delete serviceData.category;
    }
    const { data, error } = await supabase.from('services').insert([serviceData]).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Add Service Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (serviceData.category) {
      const { data: catData } = await supabase.from('service_categories').select('id').ilike('name_pt', serviceData.category).limit(1);
      if (catData && catData.length > 0) {
        serviceData.category_id = catData[0].id;
      } else {
        const { data: fallbackData } = await supabase.from('service_categories').select('id').limit(1);
        if (fallbackData && fallbackData.length > 0) serviceData.category_id = fallbackData[0].id;
      }
      delete serviceData.category;
    }
    const { data, error } = await supabase.from('services').update(serviceData).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Update Service Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('services').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  const { from, to } = req.query;
  console.log('GET /api/bookings', { from, to });
  try {
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
  } catch (err: any) {
    console.error('API Error /bookings:', err);
    res.status(500).json({ error: err.message || 'Erro ao carregar agenda' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('appointments').insert([req.body]).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('appointments').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Stats (Integrated version)
app.get('/api/dashboard', async (req, res) => {
  try {
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
      clients: clientsResult.count || 0
    });
  } catch (err: any) {
    console.error('Dashboard API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Legacy Stats endpoint for compatibility
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [sales, appts, clients] = await Promise.all([
      supabase.from('sales').select('total'),
      supabase.from('appointments').select('id', { count: 'exact', head: true }),
      supabase.from('clients').select('id', { count: 'exact', head: true })
    ]);
    
    const revenue = sales.data?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
    
    res.json({
      revenue,
      appointments: appts.count || 0,
      customers: clients.count || 0,
      conversion: 24.5
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dashboard/charts', async (req, res) => {
  try {
    const { data: sales } = await supabase.from('sales').select('total, created_at').order('created_at', { ascending: true });
    
    // Grouping logic for revenue by month
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/billing/documents', async (req, res) => {
  try {
    const { data, error } = await supabase.from('documents').select('*, sales(total, customer_id, clients(name))').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.get('/api/gallery', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      return res.json(DEFAULT_IMAGES);
    }
    
    res.json(data);
  } catch (err: any) {
    // If table doesn't exist, fallback to defaults instead of error
    res.json(DEFAULT_IMAGES);
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Imagem eliminada' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sales & POS
app.post('/api/sales', async (req, res) => {
  const { sale, items } = req.body;
  try {
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
  } catch (err: any) {
    console.error('Sale error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Inbox Routes
app.get('/api/inbox', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inbox')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inbox', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inbox')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/inbox/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inbox')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/inbox/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('inbox')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Marketing/Campaigns Routes
app.get('/api/marketing/stats', async (req, res) => {
  try {
    const [comms, camps] = await Promise.all([
      supabase.from('communications').select('*'),
      supabase.from('campaigns').select('*')
    ]);
    if (comms.error) throw comms.error;
    if (camps.error) throw camps.error;

    res.json({
      communications: comms.data,
      campaigns: camps.data
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/marketing/campaigns', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Settings Routes
app.get('/api/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    // If no settings exist yet, return defaults
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...req.body })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Client Verify (Booking Flow)
app.post('/api/clients/verify', async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    
    const { data: existing, error: findError } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    
    if (findError) throw findError;
    
    if (existing) {
      return res.json(existing);
    }
    
    const { data: created, error: createError } = await supabase
      .from('clients')
      .insert([{ name, phone, email }])
      .select()
      .single();
    
    if (createError) throw createError;
    res.json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
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

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Environment PORT detected: ${process.env.PORT || 'Using fallback 3001'}`);
});

// --- CONSOLE ERROR HANDLER ---
server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
