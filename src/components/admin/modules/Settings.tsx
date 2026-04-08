import React, { useState, useEffect } from 'react';
import { Save, User, MapPin, Phone, Instagram, Bell, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    nif: ''
  });
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    sms_reminders: false,
    marketing: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/settings');
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.post('/settings', settings);
      toast.success('Definições guardadas com sucesso');
    } catch (error) {
      toast.error('Erro ao guardar definições');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl shrink-0">
        <div>
          <h1 className="text-4xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Definições</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Gerencie as configurações do Serena Glow</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 relative z-20"
        >
          {loading ? 'A guardar...' : <><Save size={16} /> Guardar Alterações</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 dark:border-white/5 shadow-xl space-y-8">
            <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3 italic">
              <Sparkles size={24} className="text-pink-500" /> Perfil do Salão
            </h3>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nome do Salão</label>
                    <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                        <input 
                            type="text"
                            value={settings.name}
                            onChange={(e) => setSettings({...settings, name: e.target.value})}
                            className="w-full pl-14 pr-6 py-4 bg-white/40 dark:bg-white/5 border border-pink-100/30 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-bold italic"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Endereço</label>
                    <div className="relative group">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                        <input 
                            type="text"
                            value={settings.address}
                            onChange={(e) => setSettings({...settings, address: e.target.value})}
                            className="w-full pl-14 pr-6 py-4 bg-white/40 dark:bg-white/5 border border-pink-100/30 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-bold italic"
                        />
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8">
            <h3 className="text-xl font-serif font-black uppercase tracking-tighter flex items-center gap-3 italic">
              <Phone size={24} className="text-pink-500" /> Contactos & Redes
            </h3>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-4">Telemóvel</label>
                        <input 
                            type="text"
                            value={settings.phone}
                            onChange={(e) => setSettings({...settings, phone: e.target.value})}
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-bold italic"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-4">Instagram</label>
                        <input 
                            type="text"
                            value={settings.instagram}
                            onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-bold italic"
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
            <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 dark:border-white/5 shadow-xl space-y-8">
                <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3 italic">
                    <Bell size={24} className="text-pink-500" /> Notificações
                </h3>
                <div className="space-y-6">
                    {[
                        { id: 'email_bookings', label: 'E-mail em novas marcações', desc: 'Receber um aviso quando um cliente agendar online' },
                        { id: 'sms_reminders', label: 'Lembretes SMS', desc: 'Enviar SMS automático aos clientes 24h antes' },
                        { id: 'marketing', label: 'Dicas de Marketing', desc: 'Sugestões IA para campanhas semanais' }
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-6 bg-white/40 dark:bg-white/5 border border-pink-100/30 dark:border-white/10 rounded-2xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                            <div>
                                <p className="font-bold text-sm text-gray-800 dark:text-white">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{item.desc}</p>
                            </div>
                            <button 
                                onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id as keyof typeof notifications] ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-10 rounded-[3rem] text-white shadow-xl">
                <h3 className="text-xl font-serif font-black uppercase tracking-tighter mb-4 flex items-center gap-3 italic">
                    <Sparkles size={24} /> Toque Premium
                </h3>
                <div className="space-y-6">
                    <div className="p-8 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Mensagens Inspiradoras</p>
                        <p className="text-xl font-serif font-black italic">"Cuidamos da sua beleza com elegância. Detalhes que fazem a diferença."</p>
                    </div>
                    <div className="p-8 bg-black/10 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Mantra do Salão</p>
                        <p className="text-xl font-serif font-black italic leading-tight">Experiência pensada para si, beleza que brilha em cada detalhe.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
