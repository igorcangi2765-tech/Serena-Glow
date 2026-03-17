import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  FileText, 
  MessageSquare, 
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'sales', icon: <ShoppingBag size={20} />, label: 'Vendas' },
    { id: 'agenda', icon: <Calendar size={20} />, label: 'Agenda' },
    { id: 'billing', icon: <FileText size={20} />, label: 'Documentos' },
    { id: 'messaging', icon: <MessageSquare size={20} />, label: 'Mensagens' },
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

      <div className="mt-auto p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium tracking-wide">Sair</span>
        </button>
      </div>
    </div>
  );
};
