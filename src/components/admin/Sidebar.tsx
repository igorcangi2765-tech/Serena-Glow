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
  Megaphone
} from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { t, language, setLanguage } = useLanguage();
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: t('admin.dashboard') },
    { id: 'sales', icon: <ShoppingBag size={20} />, label: t('admin.sales') },
    { id: 'agenda', icon: <Calendar size={20} />, label: t('admin.agenda') },
    { id: 'billing', icon: <FileText size={20} />, label: t('admin.billing') },
    { id: 'clients', icon: <Users size={20} />, label: t('admin.clientsModule') },
    { id: 'marketing', icon: <Megaphone size={20} />, label: t('admin.marketing') },
    { id: 'inbox', icon: <Inbox size={20} />, label: t('admin.inbox') },
    { id: 'messaging', icon: <MessageSquare size={20} />, label: t('admin.messaging') },
  ];

  return (
    <div className="w-64 bg-white border-r border-pink-100 flex flex-col h-full fixed left-0 top-0 pt-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 p-3 bg-pink-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-pink-600 font-medium">Serena Glow</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {item.icon}
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <button 
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all duration-200"
        >
          <Languages size={20} />
          <span className="font-medium tracking-wide">{t('admin.language') || 'Language'}: {language.toUpperCase()}</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium tracking-wide">{t('admin.logout')}</span>
        </button>
      </div>
    </div>
  );
};
