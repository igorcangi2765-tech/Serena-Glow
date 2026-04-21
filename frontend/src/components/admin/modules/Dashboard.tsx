import { useLanguage } from '@/LanguageContext';
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Clock, Activity, Star, Mail, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';

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
  const [chartTab, setChartTab] = useState<'general' | 'services'>('general');
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
        supabase.from('appointments').select('*, services(name_pt), clients(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('inbox').select('*, created_at').order('created_at', { ascending: false }).limit(5)
      ]);

      const combinedActivity = [
        ...(salesRes.data || []).map(s => ({ ...s, activityType: 'sale' })),
        ...(apptsRes.data || []).map(a => ({ ...a, activityType: 'appointment' })),
        ...(notificationsRes.data || []).map(n => ({ ...n, activityType: 'notification' })),
        ...(inboxData.data || []).map(i => ({ ...i, activityType: 'message', customer_name: i.name }))
      ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
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
      if (data?.revenue) {
        setRevenueData(data.revenue.map((r: any) => ({ name: r.name, value: r.total })));
      }
      if (data?.services) {
        const COLORS = ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f9a8d4'];
        setServiceData(data.services.map((s: any, i: number) => ({
          name: s.name,
          value: s.count,
          color: COLORS[i % COLORS.length]
        })));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: t('admin.dashboard.stats.revenue'), value: `${stats.revenue.toLocaleString()} MZN`, sub: t('admin.dashboard.stats.revenue_desc'), icon: DollarSign, trend: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}%`, isUp: stats.revenueChange >= 0, color: 'emerald' },
    { title: t('admin.dashboard.stats.appointments'), value: stats.appointments.toString(), sub: t('admin.dashboard.stats.appointments_desc'), icon: Calendar, trend: `${stats.appointmentsChange >= 0 ? '+' : ''}${stats.appointmentsChange.toFixed(1)}%`, isUp: stats.appointmentsChange >= 0, tab: 'agenda', color: 'pink' },
    { title: t('admin.dashboard.stats.customers'), value: stats.customers.toString(), sub: t('admin.dashboard.stats.cust_desc'), icon: Users, trend: `+${stats.customersChange}%`, isUp: true, tab: 'clients', color: 'amber' },
    { title: t('admin.dashboard.stats.conversion'), value: `${stats.conversion}%`, sub: t('admin.dashboard.stats.conv_desc'), icon: TrendingUp, trend: '+1.5%', isUp: true, color: 'violet' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${systemOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em]">
              {t('admin.dashboard.system_online')}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-900 dark:text-white tracking-tighter italic">
            {t('admin.dashboard.title')}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium italic">
            {t('admin.dashboard.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
              <Clock size={12} />
              {t('admin.dashboard.indicators.next_appt')}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/10">
              <Calendar size={12} />
              {t('admin.dashboard.indicators.agenda_full')}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-500 text-[9px] font-black uppercase tracking-widest border border-zinc-500/10">
              <Activity size={12} />
              {t('admin.dashboard.indicators.no_pending')}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('agenda')}
          className="group h-16 px-8 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:shadow-2xl hover:shadow-pink-500/20 active:scale-95 transition-all w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          <span>{t('admin.ui.buttons.create_booking')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#FF3366] p-8 rounded-3xl text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl shadow-pink-200/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">
                    {t('admin.dashboard.cards.today_appts')}
                  </p>
                  <h4 className="text-3xl font-serif font-black tracking-tighter">
                    {summary.todayAppts === 0 ? t('admin.dashboard.cards.empty_appts') : `${summary.todayAppts} ${t('admin.ui.sidebar.agenda')}`}
                  </h4>
              </div>
              <p onClick={() => setActiveTab('agenda')} className="text-[10px] font-black uppercase tracking-widest mt-8 bg-white/20 px-6 py-3 rounded-full w-fit cursor-pointer hover:bg-white/30 transition-all border border-white/20 relative z-20">{t('admin.dashboard.summary.manage_agenda')}</p>
          </div>
          <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 flex flex-col justify-between shadow-xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                    {t('admin.dashboard.cards.messages')}
                  </p>
                  <h4 className="text-4xl font-serif font-black tracking-tighter text-[#1A1A1A] dark:text-white">
                    {summary.unreadMessages === 0 ? t('admin.dashboard.cards.empty_messages') : `${summary.unreadMessages} Novas`}
                  </h4>
              </div>
              <p onClick={() => setActiveTab('inbox')} className="text-[10px] font-black uppercase tracking-widest mt-8 text-[#FF3366] cursor-pointer font-bold bg-pink-500/10 px-6 py-3 rounded-full w-fit border border-pink-500/10 hover:bg-pink-500/20 transition-all relative z-20">{t('admin.dashboard.cards.messages')}</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-3xl text-white flex flex-col justify-between shadow-2xl group overflow-hidden relative border border-white/5">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-12 -mb-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                    {t('admin.dashboard.cards.billing')}
                  </p>
                  <h4 className="text-4xl font-serif font-black tracking-tighter">
                    {summary.pendingPayments === 0 ? t('admin.dashboard.cards.empty_billing') : `${summary.pendingPayments} Pendentes`}
                  </h4>
              </div>
              <p onClick={() => setActiveTab('billing')} className="text-[10px] font-black uppercase tracking-widest mt-8 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full w-fit cursor-pointer hover:bg-emerald-500/20 transition-all border border-emerald-500/10 relative z-20">{t('admin.dashboard.activity.button')}</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-serif font-black text-gray-900 dark:text-white mb-1 uppercase italic tracking-tighter">
                {t('admin.dashboard.summary_title')}
              </h4>
              <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                {t('admin.dashboard.performance.subtitle')}
              </p>
            </div>
            <div className="flex bg-gray-50 dark:bg-zinc-950 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5">
              <button 
                onClick={() => setChartTab('general')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chartTab === 'general' ? 'bg-white dark:bg-[#1E1E1E] text-pink-600 dark:text-pink-400 shadow-md border border-pink-500/5' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t('admin.dashboard.performance.tabs.general')}
              </button>
              <button 
                onClick={() => setChartTab('services')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chartTab === 'services' ? 'bg-white dark:bg-[#1E1E1E] text-pink-600 dark:text-pink-400 shadow-md border border-pink-500/5' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t('admin.dashboard.performance.tabs.services')}
              </button>
            </div>
          </div>
          <p className="text-xs text-pink-500 font-bold uppercase tracking-widest mb-8 opacity-70">
            {t('admin.dashboard.performance.activity')}
          </p>
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
              <h4 className="text-xl font-serif font-black text-gray-900 dark:text-white mb-1 uppercase italic tracking-tighter">
                {t('admin.dashboard.popular_services.title')}
              </h4>
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em]">
                {t('admin.dashboard.popular_services.subtitle')}
              </p>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 opacity-70 mt-4">
            {t('admin.dashboard.popular_services.desc')}
          </p>
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
                <span className="text-[10px] font-black uppercase text-pink-500 tracking-[0.25em]">{t('admin.ui.dashboard.charts.studio_full')}</span>
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
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-pink-500" />
              <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('admin.dashboard.activity.title')}</h4>
            </div>
          </div>

          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                    <Clock size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-300">{activity.description}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">{format(new Date(activity.timestamp), 'HH:mm')}</p>
                  </div>
                </div>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <Clock className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">{t('admin.dashboard.activity.empty')}</p>
                </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-white/5">
          <div className="mb-8">
            <h4 className="text-lg font-serif font-black text-white mb-1 uppercase italic tracking-tighter">
              {t('admin.dashboard.summary.title')}
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {t('admin.dashboard.summary.subtitle')}
            </p>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950 hover:bg-pink-50 dark:hover:bg-pink-900/10 rounded-2xl border border-pink-100/20 dark:border-white/5 group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1E1E1E] flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('admin.dashboard.summary.view_team')}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Gere a sua equipa</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
            </button>
            <button 
                onClick={() => setActiveTab('agenda')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-2xl border border-emerald-100/20 dark:border-white/5 group transition-all"
            >
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1E1E1E] flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Calendar size={20} />
                </div>
                <div className="text-left">
                    <p className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('admin.dashboard.summary.manage_agenda')}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Acesso completo</p>
                </div>
                </div>
                <ArrowUpRight size={18} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
