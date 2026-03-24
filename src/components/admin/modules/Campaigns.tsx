import React, { useState, useEffect } from 'react';
import { Megaphone, Target, Users, BarChart3, PieChart as PieChartIcon, ArrowUpRight, Plus, Send, Calendar, Mail, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Campaigns: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    conversion: 0
  });
  const [loading, setLoading] = useState(true);
  const [campaignPerformance, setCampaignPerformance] = useState([
    { name: 'Email', value: 0, color: '#f43f5e' },
    { name: 'SMS', value: 0, color: '#ec4899' },
  ]);

  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    type: 'email',
    status: 'planned',
    target_audience: 'all',
    content: ''
  });

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/marketing/stats');
      
      const comms = data.communications || [];
      const camps = data.campaigns || [];

      // Process stats
      const sentCount = comms.length || 0;
      const emailCount = comms.filter((c: any) => c.type === 'email').length || 0;
      const smsCount = comms.filter((c: any) => c.type === 'sms').length || 0;

      setStats(prev => ({
        ...prev,
        sent: sentCount,
      }));

      setCampaignPerformance([
        { name: 'Email', value: emailCount, color: '#f43f5e' },
        { name: 'SMS', value: smsCount, color: '#ec4899' },
      ]);

      setRecentCampaigns(camps);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/marketing/campaigns', newCampaign);
      toast.success('Campanha planeada com sucesso!');
      setIsNewCampaignOpen(false);
      fetchCampaignData();
    } catch (error) {
      toast.error('Erro ao criar campanha.');
    }
  };

  const handleAIGeneration = () => {
    setNewCampaign({
      title: 'Oferta de Véspera de Feriado',
      type: 'email',
      status: 'planned',
      target_audience: 'all',
      content: 'Descubra a sua melhor versão este feriado! ✨\n\nAproveite 20% de desconto em todos os serviços de facial e unhas se agendar nas próximas 48 horas.\n\nReserve já o seu momento de beleza no Serena Glow Studio.'
    });
    setIsNewCampaignOpen(true);
    toast.success('Rascunho de campanha gerado com IA!', { icon: '🤖' });
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 dark:text-white uppercase tracking-tighter">Marketing <span className="text-pink-500 font-sans tracking-normal opacity-50 font-light ml-2">/ Campanhas</span></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Expanda o alcance do seu estúdio e fidelize clientes.</p>
        </div>
        <button 
           onClick={() => setIsNewCampaignOpen(true)}
           className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95"
        >
          <Plus size={16} /> Nova Campanha
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Enviado', value: stats.sent, icon: Send, color: 'rose' },
          { title: 'Taxa de Abertura', value: '67.2%', icon: Mail, color: 'pink' },
          { title: 'Clicks Totais', value: stats.clicked, icon: Target, color: 'rose' },
          { title: 'ROI Marketing', value: '4.2x', icon: BarChart3, color: 'emerald' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl group hover:border-pink-500/30 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'emerald' ? 'emerald' : 'pink'}-500/10 flex items-center justify-center text-${stat.color === 'emerald' ? 'emerald' : 'pink'}-500 mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">{stat.title}</p>
            <p className="text-3xl font-serif font-bold text-gray-800 dark:text-white tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 dark:border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Performance por Canal</h3>
            <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-pink-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Email</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">SMS</span>
                </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  {campaignPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <h3 className="text-2xl font-serif font-bold mb-8">Dica de Crescimento</h3>
            <div className="space-y-6">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                    <p className="text-sm font-medium leading-relaxed italic">"Campanhas enviadas às <span className="font-black underline decoration-pink-300">Terças-feiras às 10h</span> têm 40% mais visualizações em Lichinga."</p>
                </div>
                <div className="pt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Próxima Sugestão</p>
                    <p className="font-serif text-lg font-bold">Oferta de Véspera de Feriado</p>
                    <p className="text-xs opacity-80 mt-2 font-sans">Ideal para aumentar as marcações nos próximos 3 dias.</p>
                </div>
                <button 
                  onClick={handleAIGeneration}
                  className="w-full py-4 bg-white text-pink-600 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all"
                >
                  Criar com IA
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 dark:border-white/5 shadow-xl">
        <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-8">Campanhas Recentes</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center opacity-30">
              <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Carregando Campanhas...</p>
            </div>
          ) : recentCampaigns.length === 0 ? (
            <div className="py-20 text-center opacity-30">
              <Megaphone size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nenhuma campanha registada.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-pink-50/50 dark:border-white/5">
                  <th className="text-left pb-6 pl-4">Campanha</th>
                  <th className="text-left pb-6">Canal</th>
                  <th className="text-left pb-6">Estado</th>
                  <th className="text-left pb-6">Alcance</th>
                  <th className="text-left pb-6">Engagement</th>
                  <th className="text-left pb-6">Data</th>
                  <th className="text-center pb-6 pr-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50/20 dark:divide-white/5">
                {recentCampaigns.map((camp) => (
                  <tr key={camp.id} className="group hover:bg-white/40 dark:hover:bg-white/5 transition-all">
                    <td className="py-6 pl-4 font-bold text-gray-800 dark:text-white text-sm">{camp.title}</td>
                    <td className="py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${camp.channel === 'email' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                          {camp.channel}
                      </span>
                    </td>
                    <td className="py-6">
                      <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                          camp.status === 'sent' ? 'text-emerald-500' : 
                          camp.status === 'scheduled' ? 'text-indigo-500' : 'text-gray-400'
                      }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                              camp.status === 'sent' ? 'bg-emerald-500' : 
                              camp.status === 'scheduled' ? 'bg-indigo-500' : 'bg-gray-400'
                          }`} />
                          {camp.status}
                      </span>
                    </td>
                    <td className="py-6 text-sm text-gray-500 font-bold">{camp.stats?.sent || 0}</td>
                    <td className="py-6 text-sm text-pink-500 font-black">
                        {camp.stats?.sent ? ((camp.stats?.opened / camp.stats?.sent) * 100).toFixed(1) + '%' : '0%'}
                    </td>
                    <td className="py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">{new Date(camp.created_at).toLocaleDateString()}</td>
                    <td className="py-6 pr-4 text-center">
                      <button 
                        onClick={() => toast.success('A exportar relatório da campanha...')}
                        className="p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all"
                      >
                          <BarChart3 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* New Campaign Modal */}
      {isNewCampaignOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-[#1E1E1E] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
            >
                <div className="p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter">Planear Campanha</h2>
                    <button onClick={() => setIsNewCampaignOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Plus size={24} className="rotate-45" />
                    </button>
                </div>
                
                <form onSubmit={handleCreateCampaign} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Título da Campanha</label>
                            <input 
                                type="text"
                                value={newCampaign.title}
                                onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 text-sm focus:ring-4 focus:ring-pink-500/10 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Canal</label>
                            <select 
                                value={newCampaign.type}
                                onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 text-sm focus:ring-4 focus:ring-pink-500/10 outline-none"
                            >
                                <option value="email">Newsletter Email</option>
                                <option value="sms">Marketing SMS</option>
                                <option value="social">Redes Sociais</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Conteúdo / Copy</label>
                        <textarea 
                            value={newCampaign.content}
                            onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                            className="w-full h-40 p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 text-sm focus:ring-4 focus:ring-pink-500/10 outline-none resize-none"
                            placeholder="Escreva o texto da sua campanha aqui..."
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all">
                        Lançar Planeamento de Campanha
                    </button>
                </form>
            </motion.div>
        </div>
      )}
    </div>
  );
};
