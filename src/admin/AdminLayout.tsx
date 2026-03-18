import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Sidebar } from '@/components/admin/Sidebar';
import { supabase } from '@/lib/supabase';

export const AdminLayout: React.FC = () => {
  const onLogout = async () => {
    await supabase.auth.signOut();
    toast('Até breve!', { icon: '👋' });
  };

  return (
    <div className="min-h-screen bg-[#FCF9FA] flex font-sans">
      <Toaster position="top-right" />
      <Sidebar onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8 pt-24 min-h-screen w-full">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
