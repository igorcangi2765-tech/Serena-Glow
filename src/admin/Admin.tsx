import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/LanguageContext';
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
import { toast, Toaster } from 'react-hot-toast';

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

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
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4 font-sans">
        <Toaster position="top-right" />
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-pink-100 border border-pink-50 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50" />
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-pink-200">
              <span className="text-white text-3xl font-serif">S</span>
            </div>
            
            <h1 className="text-4xl font-serif text-gray-800 mb-2 text-center">{t('admin.loginTitle')}</h1>
            <p className="text-gray-500 text-center mb-10 font-medium tracking-wide">Serena Glow | {t('admin.loginSubtitle')}</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  {t('admin.emailLabel')}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-pink-50 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 bg-pink-50/30 transition-all font-sans text-lg"
                  placeholder={t('admin.emailPlaceholder')}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  {t('admin.passwordLabel')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-pink-50 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 bg-pink-50/30 transition-all font-sans text-lg"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-5 rounded-2xl font-bold tracking-widest hover:shadow-xl hover:shadow-pink-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-sm"
              >
                {loading ? (t('admin.signingIn') || 'Entrando...') : t('admin.enter')}
              </button>
            </form>
          </div>
        </div>
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
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9FA] flex font-sans">
      <Toaster position="top-right" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8 pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
