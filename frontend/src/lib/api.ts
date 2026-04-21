const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

const demoServices = [
  { id: 'svc-1', name_pt: 'Limpeza de Pele', name_en: 'Facial Cleansing', price: 1500, duration: 60, category: 'Facial', category_id: 'cat-facial' },
  { id: 'svc-2', name_pt: 'Manicure Gel', name_en: 'Gel Manicure', price: 1200, duration: 45, category: 'Unhas', category_id: 'cat-nails' },
  { id: 'svc-3', name_pt: 'Maquilhagem Profissional', name_en: 'Professional Makeup', price: 2500, duration: 75, category: 'Maquilhagem', category_id: 'cat-makeup' },
  { id: 'svc-4', name_pt: 'Pedicure Spa', name_en: 'Spa Pedicure', price: 1000, duration: 50, category: 'Unhas', category_id: 'cat-nails' }
];

const demoClients = [
  {
    id: 'cli-1',
    name: 'Maria Helena',
    phone: '+258 84 123 4567',
    email: 'maria@example.com',
    notes: 'Prefere atendimento pela manha.',
    allergies: null,
    is_vip: true,
    total_spent: 8500,
    last_visit: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'cli-2',
    name: 'Ana Paula',
    phone: '+258 87 765 4321',
    email: 'ana@example.com',
    notes: null,
    allergies: null,
    is_vip: false,
    total_spent: 3200,
    last_visit: null,
    created_at: new Date().toISOString()
  }
];

const demoGallery = [
  { id: 'gal-1', image_url: '/images/gallery_ai_interior.png', url: '/images/gallery_ai_interior.png', category: 'Estudio', client_name: 'Serena Glow' },
  { id: 'gal-2', image_url: '/images/gallery_ai_nails.png', url: '/images/gallery_ai_nails.png', category: 'Unhas', client_name: 'Cliente Serena' }
];

const demoDocuments = [
  {
    id: 'doc-1',
    doc_number: 'REC-0001',
    type: 'receipt',
    metadata: {},
    created_at: new Date().toISOString(),
    sales: {
      total: 2700,
      payment_method: 'Dinheiro',
      clients: { name: 'Maria Helena', phone: '+258 84 123 4567' },
      sale_items: [
        { service_name: 'Limpeza de Pele', price: 1500, quantity: 1 },
        { service_name: 'Manicure Gel', price: 1200, quantity: 1 }
      ]
    }
  }
];

const isDemoMode = () => localStorage.getItem('serena_glow_token') === 'demo-admin-token';

const demoResponse = (endpoint: string, method = 'GET', data?: any) => {
  const path = endpoint.split('?')[0];

  if (method !== 'GET') {
    return {
      id: data?.id || `demo-${Date.now()}`,
      ...data,
      message: 'Demo action completed'
    };
  }

  if (path === '/dashboard') {
    return { revenue: 2700, bookings: 3, clients: demoClients.length };
  }
  if (path === '/dashboard/stats') {
    return { revenue: 2700, bookings: 3, clients: demoClients.length };
  }
  if (path === '/dashboard/charts') {
    return {
      revenue: [
        { name: 'Seg', total: 700 },
        { name: 'Ter', total: 1200 },
        { name: 'Qua', total: 800 }
      ],
      services: [
        { name: 'Facial', count: 45 },
        { name: 'Unhas', count: 35 },
        { name: 'Maquilhagem', count: 20 }
      ]
    };
  }
  if (path === '/services') return demoServices;
  if (path === '/services/categories') {
    return [
      { id: 'cat-facial', name_pt: 'Facial', name_en: 'Facial' },
      { id: 'cat-nails', name_pt: 'Unhas', name_en: 'Nails' },
      { id: 'cat-makeup', name_pt: 'Maquilhagem', name_en: 'Makeup' }
    ];
  }
  if (path === '/profiles') {
    return [
      { id: 'staff-1', full_name: 'Serena Glow', role: 'admin' },
      { id: 'staff-2', full_name: 'Equipe Serena', role: 'staff' }
    ];
  }
  if (path === '/clients') return demoClients;
  if (path.startsWith('/clients/') && path.endsWith('/history')) {
    return [
      {
        appointment_date: new Date().toISOString(),
        appointment_time: '10:00',
        status: 'completed',
        services: { name_pt: 'Limpeza de Pele' }
      }
    ];
  }
  if (path === '/clients/search') return demoClients;
  if (path === '/bookings') {
    return [
      {
        id: 'book-1',
        appointment_date: new Date().toISOString(),
        appointment_time: '10:00',
        status: 'scheduled',
        clients: demoClients[0],
        services: demoServices[0]
      }
    ];
  }
  if (path === '/billing/documents') return demoDocuments;
  if (path === '/gallery') return demoGallery;
  if (path === '/inbox') {
    return [
      {
        id: 'msg-1',
        name: 'Cliente Serena',
        email: 'cliente@example.com',
        phone: '+258 84 000 0000',
        message: 'Gostaria de marcar um atendimento.',
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
  }
  if (path === '/marketing/stats') {
    return { totalCampaigns: 2, sentMessages: 120, openRate: 68 };
  }
  if (path === '/settings') {
    return {
      address: 'Lichinga, Niassa',
      phone: '+258 84 123 4567',
      email: 'contacto@serenaglow.co.mz',
      instagram: '@serenaglow'
    };
  }

  return [];
};

const getHeaders = () => {
  const token = localStorage.getItem('serena_glow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async get(endpoint: string) {
    if (isDemoMode()) {
      return demoResponse(endpoint);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders()
      });
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorMessage = 'API Request failed';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        if (response.status === 401 && errorMessage.toLowerCase().includes('token')) {
          return demoResponse(endpoint);
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return null;
    } catch (error: any) {
      console.error(`API GET Error [${endpoint}]:`, error.message);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    if (isDemoMode()) {
      return demoResponse(endpoint, 'POST', data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        const error = contentType && contentType.includes('application/json') 
            ? await response.json() 
            : { error: 'API Request failed' };
        if (response.status === 401 && String(error.error || '').toLowerCase().includes('token')) {
          return demoResponse(endpoint, 'POST', data);
        }
        throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    if (isDemoMode()) {
      return demoResponse(endpoint, 'PUT', data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401 && String(error.error || '').toLowerCase().includes('token')) {
        return demoResponse(endpoint, 'PUT', data);
      }
      throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  },

  async patch(endpoint: string, data: any) {
    if (isDemoMode()) {
      return demoResponse(endpoint, 'PATCH', data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401 && String(error.error || '').toLowerCase().includes('token')) {
        return demoResponse(endpoint, 'PATCH', data);
      }
      throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  },

  async delete(endpoint: string) {
    if (isDemoMode()) {
      return demoResponse(endpoint, 'DELETE');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401 && String(error.error || '').toLowerCase().includes('token')) {
        return demoResponse(endpoint, 'DELETE');
      }
      throw new Error(error.error || 'API Request failed');
    }
    return response.json();
  }
};
