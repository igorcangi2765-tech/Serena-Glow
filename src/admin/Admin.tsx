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
      <div className={`min-h-screen flex items-center justify-center px-4 transition-all duration-1000 ${
        isDark ? 'bg-[#050505]' : 'bg-gradient-to-b from-[#FFF1F5] to-[#FFFFFF]'
      }`}>
        <Toaster position="top-right" />
        
        {/* Glow effect behind card */}
        {!isDark && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-200/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        )}
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-pink-900/10' : 'bg-pink-200/10'}`} />
          <div className={`absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-rose-900/10' : 'bg-rose-200/10'}`} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-[420px] p-10 lg:p-14 rounded-[3rem] border transition-all duration-700 z-10 ${
            isDark 
              ? 'bg-zinc-900/40 backdrop-blur-3xl border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.8)]' 
              : 'bg-white/80 backdrop-blur-3xl border-white shadow-[0_32px_64px_rgba(233,30,99,0.08)]'
          }`}
        >
          <div className="relative">
            {/* Logo Area */}
            <motion.div 
               whileHover={{ scale: 1.05, rotate: 8 }}
               whileTap={{ scale: 0.95 }}
               className="w-20 h-20 bg-gradient-to-br from-[#F471B5] via-[#E91E63] to-[#C2185B] rounded-[2rem] mx-auto mb-12 flex items-center justify-center shadow-2xl shadow-pink-500/30 cursor-pointer"
            >
              <span className="text-white text-3xl font-serif font-black drop-shadow-md">S</span>
            </motion.div>
            
            <div className="text-center mb-14">
                <h1 className={`text-4xl font-serif font-black tracking-tighter mb-3 uppercase ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    Serena <span className="text-[#E91E63]">Glow</span>
                </h1>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] opacity-80">Software de Gestão de Luxo</p>
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
                  className={`w-full px-7 py-5 rounded-[1.5rem] border transition-all font-medium text-sm outline-none ${
                      isDark 
                          ? 'bg-black/40 border-white/5 text-white focus:border-pink-500/50 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                          : 'bg-[#F9FAFB] border-[#F3F4F6] text-[#1E1E1E] focus:border-[#E91E63] focus:ring-8 focus:ring-pink-500/5 placeholder:text-[#9CA3AF]'
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
                  className={`w-full px-7 py-5 rounded-[1.5rem] border transition-all font-medium text-sm outline-none ${
                        isDark 
                            ? 'bg-black/40 border-white/5 text-white focus:border-pink-500/50 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                            : 'bg-[#F9FAFB] border-[#F3F4F6] text-[#1E1E1E] focus:border-[#E91E63] focus:ring-8 focus:ring-pink-500/5 placeholder:text-[#9CA3AF]'
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
                    className={`group w-full h-18 rounded-[1.5rem] font-black tracking-[0.4em] uppercase text-[12px] transition-all flex items-center justify-center gap-3 active:scale-[0.97] shadow-2xl relative overflow-hidden ${
                        isDark 
                            ? 'bg-white text-black hover:bg-zinc-100' 
                            : 'bg-gradient-to-r from-[#F06292] to-[#E91E63] text-white hover:shadow-pink-500/30'
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
