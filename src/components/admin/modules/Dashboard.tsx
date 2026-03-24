import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Clock, Activity, Star, Mail, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useLanguage } from '@/LanguageContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    appointments: 0,
    customers: 0,
    conversion: 0,
    revenueChange: 0,
    appointmentsChange: 0,
    customersChange: 0
  });
  const [systemOnline, setSystemOnline] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [topService, setTopService] = useState({ name: 'Carregando...', growth: 0 });
  const [summary, setSummary] = useState({
    todayAppts: 0,
    unreadMessages: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.get('/dashboard');
      setStats({
        revenue: data.revenue,
        appointments: data.bookings,
        customers: data.clients,
        conversion: 24.5,
        revenueChange: 12.5,
        appointmentsChange: 8.2,
        customersChange: 5.4
      });

      const { data: health, error: healthError } = await supabase.from('services').select('id', { count: 'exact', head: true });
      setSystemOnline(!healthError);

      const unreadCount = (await supabase.from('inbox').select('*', { count: 'exact', head: true }).eq('status', 'unread')).count || 0;

      const pendingSales = await supabase.from('sales').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setSummary({
        todayAppts: data.bookings || 0,
        unreadMessages: unreadCount,
        pendingPayments: pendingSales.count || 0
      });

      setTopService({ name: 'Cílios Fio a Fio', growth: 18 });

      const [salesRes, apptsRes, notificationsRes, inboxData] = await Promise.all([
        supabase.from('sales').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('appointments').select('*, services(name), clients(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('inbox').select('*, created_at').order('created_at', { ascending: false }).limit(5)
      ]);

      const combinedActivity = [
        ...(salesRes.data || []).map(s => ({ ...s, activityType: 'sale' })),
        ...(apptsRes.data || []).map(a => ({ ...a, activityType: 'appointment' })),
        ...(notificationsRes.data || []).map(n => ({ ...n, activityType: 'notification' })),
        ...(inboxData.data || []).map(i => ({ ...i, activityType: 'message', customer_name: i.name }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 10);
      
      setRecentActivity(combinedActivity);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const data = await api.get('/dashboard/charts');
      setRevenueData(data.revenue.map((r: any) => ({ name: r.name, value: r.total })));
      const COLORS = ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f9a8d4'];
      setServiceData(data.popular.map((s: any, i: number) => ({
        name: s.name,
        value: s.value,
        color: COLORS[i % COLORS.length]
      })));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Receita Total', value: `${stats.revenue.toLocaleString()} MZN`, sub: 'Valor total gerado pelo salão', icon: DollarSign, trend: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}%`, isUp: stats.revenueChange >= 0, color: 'emerald' },
    { title: 'Marcações', value: stats.appointments.toString(), sub: 'Número de atendimentos agendados', icon: Calendar, trend: `${stats.appointmentsChange >= 0 ? '+' : ''}${stats.appointmentsChange.toFixed(1)}%`, isUp: stats.appointmentsChange >= 0, tab: 'agenda', color: 'pink' },
    { title: 'Clientes', value: stats.customers.toString(), sub: 'Total de clientes registadas', icon: Users, trend: `+${stats.customersChange}%`, isUp: true, tab: 'clients', color: 'amber' },
    { title: 'Taxa de Conversão', value: `${stats.conversion}%`, sub: 'Percentagem de marcações concluídas', icon: TrendingUp, trend: '+1.5%', isUp: true, color: 'violet' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Painel Geral</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic text-sm">Bem-vinda ao controlo do Serena Glow</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border ${systemOnline ? 'border-emerald-500/20' : 'border-rose-500/20'} backdrop-blur-md`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${systemOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {systemOnline ? 'Sistema Online' : 'Sistema Offline'}
                </span>
            </div>
            <button 
                onClick={() => setActiveTab('agenda')}
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95"
            >
                <Plus size={16} /> Nova Marcação
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#FF3366] p-8 rounded-3xl text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl shadow-pink-200/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Marcações de Hoje</p>
                  <h4 className="text-3xl font-serif font-black tracking-tighter">{summary.todayAppts} Marcações</h4>
              </div>
              <p onClick={() => setActiveTab('agenda')} className="text-[10px] font-black uppercase tracking-widest mt-8 bg-white/20 px-6 py-3 rounded-full w-fit cursor-pointer hover:bg-white/30 transition-all border border-white/20 relative z-20">Agenda Diária</p>
          </div>
          <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 flex flex-col justify-between shadow-xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A1A1AA] mb-2">Mensagens Pendentes</p>
                  <h4 className="text-4xl font-serif font-black tracking-tighter text-[#1A1A1A] dark:text-white">{summary.unreadMessages} Novas</h4>
              </div>
              <p onClick={() => setActiveTab('inbox')} className="text-[10px] font-black uppercase tracking-widest mt-8 text-[#FF3366] cursor-pointer font-bold bg-pink-500/10 px-6 py-3 rounded-full w-fit border border-pink-500/10 hover:bg-pink-500/20 transition-all relative z-20">Ir para Inbox</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl text-white flex flex-col justify-between shadow-2xl group overflow-hidden relative border border-white/5">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-12 -mb-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Faturas em Aberto</p>
                  <h4 className="text-4xl font-serif font-black tracking-tighter">{summary.pendingPayments} Pendentes</h4>
              </div>
              <p onClick={() => setActiveTab('billing')} className="text-[10px] font-black uppercase tracking-widest mt-8 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full w-fit cursor-pointer hover:bg-emerald-500/20 transition-all border border-emerald-500/10 relative z-20">Histórico de Recibos</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => stat.tab && setActiveTab(stat.tab)}
            className={`cursor-pointer group relative overflow-hidden bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl transition-all duration-300`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-2xl shadow-inner`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${stat.isUp ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.25em] mb-1">{stat.title}</p>
              <p className="text-3xl font-serif font-bold text-gray-800 dark:text-white tracking-tighter whitespace-normal">{stat.value}</p>
              <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 italic mt-2">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <Activity size={24} className="text-pink-500" /> Desempenho do Salão
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Acompanhe a evolução das receitas e atendimentos</p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2 bg-pink-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-200/50">Geral</button>
              <button className="px-5 py-2 bg-white dark:bg-[#121212] text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-pink-50/50">Serviços</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" opacity={0.3} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} 
                    dy={15}
                />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: 'white' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'black', color: '#f43f5e', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f43f5e" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl flex flex-col"
        >
          <div className="mb-10">
              <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <Star size={24} className="text-pink-500" /> Serviços Mais Procurados
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Os favoritos das nossas clientes</p>
          </div>
          <div className="flex-grow flex items-center justify-center relative scale-110">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter">78%</span>
                <span className="text-[10px] font-black uppercase text-pink-500 tracking-[0.25em]">Estúdio Full</span>
            </div>
          </div>
          <div className="mt-10 space-y-5">
            {serviceData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest dark:text-gray-400 group-hover:text-pink-500 transition-colors">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-gray-800 dark:text-white">{item.value}%</span>
                </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-10 border-b border-pink-50/50 pb-6">
            <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white flex items-center gap-3">
              <Activity className="text-pink-500" />
              Atividade Real
            </h3>
            <button className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] border-b-2 border-pink-500/30 pb-1 hover:border-pink-500 transition-all">Ver Histórico</button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (idx * 0.05) }}
                className="flex items-center gap-5 p-5 hover:bg-white dark:hover:bg-white/5 rounded-3xl transition-all group border border-transparent hover:border-pink-50/50"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:rotate-3 ${
                    activity.activityType === 'sale' ? 'bg-emerald-50 text-emerald-500' : 
                    activity.activityType === 'appointment' ? 'bg-indigo-50 text-indigo-500' : 'bg-rose-50 text-rose-500'
                }`}>
                    {activity.activityType === 'sale' ? <DollarSign size={20} /> : 
                     activity.activityType === 'appointment' ? <Calendar size={20} /> : 
                     activity.activityType === 'message' ? <Mail size={20} className="text-amber-500" /> : <Star size={20} />}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                    {activity.clients?.name || activity.customer_name || activity.title || 'Studio Event'}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1 opacity-70">
                    {activity.services?.name || activity.activityType} • {activity.created_at ? new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                  </p>
                </div>
                {activity.total && (
                    <div className="text-right">
                        <span className="font-serif font-bold text-emerald-500 text-lg">+{activity.total.toLocaleString()}</span>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">MZM</p>
                    </div>
                )}
              </motion.div>
            )) : (
              <p className="text-sm text-gray-500 italic py-12 text-center">Nenhuma atividade registada hoje.</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full -mr-40 -mt-40 blur-3xl transition-transform duration-1000 group-hover:scale-125" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/10 rounded-full -ml-20 -mb-20 blur-2xl" />
            
            <div className="relative h-full flex flex-col justify-between w-full">
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Star className="text-pink-500" size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">Business Insight</span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-4 tracking-tighter italic">Performance de {new Date().toLocaleDateString('pt-PT', { month: 'long' })}</h3>
                    <div className="text-white/60 text-sm font-medium leading-relaxed w-full">
                        A faturação {stats.revenueChange >= 0 ? 'subiu' : 'desceu'}{' '}
                        <span className={`${stats.revenueChange >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>
                            {Math.abs(stats.revenueChange).toFixed(1)}%
                        </span>{' '}
                        em relação ao mês anterior. {topService.name} continua a ser o motor do seu estúdio.
                    </div>
                </div>
                
                <div className="mt-12 space-y-4">
                    <button 
                        onClick={() => setActiveTab('sales')}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] shadow-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-white/10"
                    >
                        Abrir POS Profissional
                    </button>
                    <button 
                        onClick={() => setActiveTab('agenda')}
                        className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] hover:bg-white/10 transition-all font-black italic"
                    >
                        Gerir Agenda
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
