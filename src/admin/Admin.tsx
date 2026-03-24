import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/LanguageContext';
import { useTheme } from '@/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/admin/Sidebar';
import { Dashboard } from '@/components/admin/modules/Dashboard';
import { SalesPOS } from '@/components/admin/modules/SalesPOS';
import { Agenda } from '@/components/admin/modules/Agenda';
import { Billing } from '@/components/admin/modules/Billing';
import { Messaging } from '@/components/admin/modules/Messaging';
import { Clients } from '@/components/admin/modules/Clients';
import { Campaigns } from '@/components/admin/modules/Campaigns';
import { Inbox } from '@/components/admin/modules/Inbox';
import { Services } from '@/components/admin/modules/Services';
import { Gallery } from '@/components/admin/modules/Gallery';
import { Settings } from '@/components/admin/modules/Settings';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Menu as MenuIcon, X as CloseIcon, User as UserIcon } from 'lucide-react';

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo login with requested credentials
    if (email.toLowerCase() === 'serena' && password === 'admin123') {
      setIsLoggedIn(true);
      toast.success(t('admin.welcomeBack') || 'Bem-vinda de volta, Serena!');
    } else {
      toast.error(t('admin.invalidPassword'));
    }
    setLoading(false);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    toast(t('admin.seeYouSoon') || 'Até breve!', { icon: '👋' });
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-700 ${
        isDark ? 'bg-black' : 'bg-[#FAFAFA]'
      }`}>
        <Toaster position="top-right" />
        
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-pink-900' : 'bg-pink-100'}`} />
          <div className={`absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-rose-900' : 'bg-rose-100'}`} />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={`relative w-full max-w-[400px] p-10 lg:p-12 rounded-[2.5rem] border transition-all duration-700 shadow-2xl z-10 ${
            isDark 
              ? 'bg-zinc-900/40 backdrop-blur-2xl border-white/5 shadow-black/50' 
              : 'bg-white/70 backdrop-blur-2xl border-pink-50 shadow-pink-100/20'
          }`}
        >
          <div className="relative">
            {/* Logo Area */}
            <motion.div 
               whileHover={{ scale: 1.1, rotate: 12 }}
               whileTap={{ scale: 0.95 }}
               className="w-20 h-20 bg-gradient-to-br from-[#E91E63] to-[#C2185B] rounded-[2rem] mx-auto mb-10 flex items-center justify-center shadow-2xl shadow-pink-500/20 cursor-pointer"
            >
              <span className="text-white text-3xl font-serif font-black drop-shadow-lg">S</span>
            </motion.div>
            
            <div className="text-center mb-12">
                <h1 className={`text-3xl font-serif font-black tracking-tighter mb-2 uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Serena <span className="text-[#E91E63]">Glow</span>
                </h1>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Painel de Gestão Integrado</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Email de Acesso
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-medium text-sm outline-none ${
                      isDark 
                          ? 'bg-black/40 border-white/5 text-white focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                          : 'bg-zinc-50 border-zinc-100 text-zinc-900 focus:border-pink-500/30 focus:ring-4 focus:ring-pink-500/5 placeholder:text-zinc-300'
                  }`}
                  placeholder="serena"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Palavra-Passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-medium text-sm outline-none ${
                        isDark 
                            ? 'bg-black/40 border-white/5 text-white focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                            : 'bg-zinc-50 border-zinc-100 text-zinc-900 focus:border-pink-500/30 focus:ring-4 focus:ring-pink-500/5 placeholder:text-zinc-300'
                    }`}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group w-full h-16 rounded-2xl font-black tracking-[0.3em] uppercase text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl ${
                        isDark 
                            ? 'bg-white text-black hover:bg-zinc-100 hover:shadow-white/10' 
                            : 'bg-[#1E1E1E] text-white hover:bg-black hover:shadow-black/20'
                    }`}
                  >
                    {loading ? (
                        <div className={`w-5 h-5 border-2 rounded-full animate-spin ${isDark ? 'border-black border-t-transparent' : 'border-white border-t-transparent'}`} />
                    ) : (
                        <>
                            <span>Aceder</span>
                            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                    )}
                  </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

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
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
