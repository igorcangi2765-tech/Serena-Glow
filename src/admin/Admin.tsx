import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/LanguageContext';
import { useTheme } from '@/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/admin/Sidebar';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

// Lazy Load Admin Modules for Performance
const Dashboard = React.lazy(() => import('@/components/admin/modules/Dashboard').then(m => ({ default: m.Dashboard })));
const SalesPOS = React.lazy(() => import('@/components/admin/modules/SalesPOS').then(m => ({ default: m.SalesPOS })));
const Agenda = React.lazy(() => import('@/components/admin/modules/Agenda').then(m => ({ default: m.Agenda })));
const Billing = React.lazy(() => import('@/components/admin/modules/Billing').then(m => ({ default: m.Billing })));
const Messaging = React.lazy(() => import('@/components/admin/modules/Messaging').then(m => ({ default: m.Messaging })));
const Clients = React.lazy(() => import('@/components/admin/modules/Clients').then(m => ({ default: m.Clients })));
const Campaigns = React.lazy(() => import('@/components/admin/modules/Campaigns').then(m => ({ default: m.Campaigns })));
const Inbox = React.lazy(() => import('@/components/admin/modules/Inbox').then(m => ({ default: m.Inbox })));
const Services = React.lazy(() => import('@/components/admin/modules/Services').then(m => ({ default: m.Services })));
const Gallery = React.lazy(() => import('@/components/admin/modules/Gallery').then(m => ({ default: m.Gallery })));
const Settings = React.lazy(() => import('@/components/admin/modules/Settings').then(m => ({ default: m.Settings })));

const LoadingModule = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">A carregar módulo...</p>
    </div>
);

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao encerrar sessão');
    } else {
      toast.success('Até breve!', { icon: '👋', style: { borderRadius: '20px', fontWeight: 'bold' } });
      navigate('/admin/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'sales': return <SalesPOS />;
      case 'agenda': return <Agenda />;
      case 'billing': return <Billing />;
      case 'messaging': return <Messaging />;
      case 'clients': return <Clients />;
      case 'marketing': return <Campaigns />;
      case 'inbox': return <Inbox />;
      case 'services': return <Services />;
      case 'gallery': return <Gallery />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#050505] text-[#EAEAEA]' : 'bg-[#FCF9FA] text-gray-800'} flex font-sans`}>
      <Toaster position="top-right" />
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-20 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-pink-100/30 dark:border-white/5 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-200/50">
                <span className="text-xl font-serif font-black">S</span>
            </div>
            <span className="font-serif font-black uppercase tracking-widest text-[#1A1A1A] dark:text-white text-sm">Serena <span className="text-pink-500">Glow</span></span>
        </div>
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-pink-50 dark:bg-white/5 text-pink-600 dark:text-pink-400 rounded-2xl hover:bg-pink-100 transition-colors"
        >
            <MenuIcon size={24} />
        </button>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
        }} 
        onLogout={onLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className={`flex-1 ${isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-80'} p-8 lg:p-12 pt-28 lg:pt-16 min-h-screen transition-all duration-500 w-full overflow-x-hidden`}>
        <div className="w-full max-w-[1600px] mx-auto">
          <React.Suspense fallback={<LoadingModule />}>
            {renderContent()}
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};
