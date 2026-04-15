import { useLanguage } from '@/LanguageContext';
import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Languages, 
  Shield, 
  Trash2, 
  Edit, 
  Check, 
  ChevronRight,
  Save,
  Clock,
  Briefcase,
  Smartphone,
  Globe,
  Camera,
  Mail,
  Phone,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '@/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export const Settings: React.FC = () => {
  const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<'profile' | 'team' | 'system'>('profile');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    name: 'Serena Glow – Beauty Salon',
    email: 'contacto@serenaglow.co.mz',
    phone: '+258 84 123 4567',
    address: 'Av. Samora Machel, Lichinga – Niassa',
    currency: 'MZN',
    notifications: true,
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-[0.3em]">
              Gestão administrativa
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-900 dark:text-white tracking-tighter italic">
            {t('admin.settings.title')}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium italic">
            {t('admin.settings.subtitle')}
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="group h-16 px-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:shadow-2xl hover:shadow-pink-500/20 active:scale-95 transition-all w-full md:w-auto justify-center"
        >
          {loading ? <Clock className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{loading ? 'A guardar...' : t('admin.ui.buttons.save_changes')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                  {t('admin.settings.profile.title')}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                   {t('admin.settings.profile.subtitle')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                   {t('admin.settings.profile.fields.name')}
                </label>
                <input 
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-transparent focus:border-pink-500/50 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                   {t('admin.settings.profile.fields.contact')}
                </label>
                <input 
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-transparent focus:border-pink-500/50 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                   {t('admin.settings.profile.fields.address')}
                </label>
                <input 
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-transparent focus:border-pink-500/50 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-xl font-serif font-black text-white uppercase tracking-tighter italic">
                  {t('admin.settings.team.professionals')}
                </h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                  Gerir acesso da equipa
                </p>
              </div>
              <button className="h-12 px-6 rounded-xl bg-white text-gray-900 font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">
                {t('admin.ui.buttons.add_professional') || 'Adicionar profissional'}
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/5 py-12 flex flex-col items-center justify-center text-center px-10 relative z-10">
               <Briefcase size={40} className="text-gray-700 mb-4" />
               <p className="text-sm font-bold text-gray-400 italic mb-2">{t('admin.ui.empty.team')}</p>
               
               <div className="mt-6 w-full max-w-xs space-y-4">
                  <div className="space-y-2 text-left">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                      {t('admin.settings.team.access_type.label')}
                    </label>
                    <select className="w-full h-12 px-4 rounded-xl bg-gray-900 border border-white/5 text-xs text-white outline-none focus:border-pink-500/50">
                      <option>{t('admin.settings.team.access_type.staff')}</option>
                      <option>{t('admin.settings.team.access_type.admin')}</option>
                    </select>
                    <p className="text-[9px] text-gray-500 italic mt-1">{t('admin.settings.team.access_type.desc')}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Section */}
        <div className="space-y-8">
          <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Languages size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                  {t('admin.settings.system.title')}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  {t('admin.settings.system.subtitle')}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                  {t('admin.settings.system.fields.language')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setLanguage('pt')}
                    className={`h-14 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border ${language === 'pt' ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-gray-50 dark:bg-zinc-900 border-transparent text-gray-400'}`}
                  >
                    Português
                  </button>
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`h-14 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border ${language === 'en' ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-gray-50 dark:bg-zinc-900 border-transparent text-gray-400'}`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
                   {t('admin.settings.system.fields.notifications')}
                </label>
                <button 
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`w-full h-14 flex items-center justify-between px-6 rounded-xl border transition-all ${settings.notifications ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' : 'bg-gray-50 dark:bg-zinc-900 border-transparent text-gray-400'}`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest italic">{settings.notifications ? 'Activas' : 'Desactivadas'}</span>
                  <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${settings.notifications ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-5' : ''}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 dark:border-white/5 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <Shield size={20} />
                </div>
                <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('admin.settings.roles.title')}</h4>
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest opacity-60 mb-6 italic leading-relaxed">
                {t('admin.settings.roles.desc')}
             </p>
             <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest border-b-2 border-pink-500/30 pb-1 hover:border-pink-500 transition-all">
                {t('admin.settings.roles.new')}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
