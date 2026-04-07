export interface Service {
  id: string;
  name_pt: string;
  name_en: string;
  price: number;
  duration?: number;
  description_pt?: string;
  description_en?: string;
  category_id: string;
  image_url?: string;
  category?: ServiceCategory;
}

export interface ServiceCategory {
  id: string;
  name_pt: string;
  name_en: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  category: string;
  title?: string;
  created_at?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  notes?: string;
  created_at?: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  total_price?: number;
  client?: Client;
  service?: Service;
}

export interface DashboardStats {
  revenue: number;
  bookings: number;
  clients: number;
  conversion: number;
  revenueChange: number;
  bookingsChange: number;
  clientsChange: number;
}
