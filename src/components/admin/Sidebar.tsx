import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  FileText, 
  MessageSquare, 
  LogOut,
  User,
  Users,
  Inbox,
  Languages,
  Megaphone,
  Sun,
  Moon,
  Scissors,
  Image as ImageIcon,
  Settings as SettingsIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/LanguageContext';
import { useTheme } from '@/ThemeContext';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isOpen = true, onClose, isCollapsed = false, onToggleCollapse }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Painel Geral' },
    { id: 'agenda', icon: <Calendar size={20} />, label: 'Agenda' },
    { id: 'sales', icon: <ShoppingBag size={20} />, label: 'Vendas' },
    { id: 'billing', icon: <FileText size={20} />, label: 'Recibos' },
    { id: 'clients', icon: <Users size={20} />, label: 'Clientes' },
    { id: 'services', icon: <Scissors size={20} />, label: 'Serviços' },
    { id: 'marketing', icon: <Megaphone size={20} />, label: 'Marketing' },
    { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Galeria' },
    { id: 'inbox', icon: <Inbox size={20} />, label: t('admin.inbox') },
    { id: 'settings', icon: <SettingsIcon size={20} />, label: 'Configurações' },
  ];

  return (
    <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
        onClick={onClose}
      />
    )}

    <div className={`${isCollapsed ? 'w-24' : 'w-80'} bg-white/40 dark:bg-[#0A0A0A]/60 backdrop-blur-[32px] border-r border-white/20 dark:border-white/5 flex flex-col h-full fixed left-0 top-0 pt-8 lg:pt-16 z-50 transition-all duration-500 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="p-4 lg:p-6 flex flex-col h-full relative">
        {/* Toggle Collapse Button (Desktop) */}
        <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-4 top-24 w-8 h-8 items-center justify-center bg-white dark:bg-[#1E1E1E] border border-pink-100/50 dark:border-white/10 rounded-full text-pink-500 shadow-lg hover:scale-110 transition-transform z-50"
        >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-6 right-6 p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className={`flex items-center gap-4 mb-8 p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-[1.5rem] border border-pink-100/30 dark:border-pink-500/10 shadow-sm group ${isCollapsed ? 'justify-center p-2' : ''}`}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-200/50 dark:shadow-pink-900/20 group-hover:rotate-6 transition-transform shrink-0">
            <User size={24} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex flex-col justify-center">
                <p className="text-sm font-bold text-gray-800 dark:text-[#EAEAEA] truncate leading-tight">Serena Glow Admin</p>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase tracking-widest opacity-80 mt-1 truncate">Gestao Studio</p>
            </div>
          )}
        </div>

        <nav className="space-y-1.5 flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative group overflow-hidden shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 dark:text-[#A0A0A0] hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/10'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-tab"
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="relative z-10 font-bold tracking-wide text-sm uppercase whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-[#1E1E1E] border border-pink-100/20 dark:border-[#2E2E2E] text-gray-600 dark:text-[#A0A0A0] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-300 group"
              >
                {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-pink-500" />}
              </button>
              
              <button 
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-[#1E1E1E] border border-pink-100/20 dark:border-[#2E2E2E] text-gray-600 dark:text-[#A0A0A0] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-300 group"
              >
                <img
                  src={language === 'pt' ? '/icons/mz.png' : '/icons/en.png'}
                  alt={language === 'pt' ? 'PT' : 'EN'}
                  className="w-5 h-5 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-black text-pink-500">{language.toUpperCase()}</span>
              </button>
          </div>

          <button
            onClick={onLogout}
            className={`w-full h-14 flex items-center justify-center gap-4 px-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-black dark:hover:bg-gray-100 transition-all duration-300 group ${isCollapsed ? 'px-0' : ''}`}
          >
            <LogOut size={16} className={`transition-transform group-hover:-translate-x-1 ${isCollapsed ? 'm-0' : ''}`} />
            {!isCollapsed && <span>{t('admin.logout')}</span>}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
