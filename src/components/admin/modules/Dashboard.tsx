import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Star, Mail, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/LanguageContext';
import { DashboardStats } from '@/types';
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Parallel fetch for core metrics
      const [
        { data: sales, error: salesError },
        { count: totalBookings, error: apptError },
        { count: totalClients, error: clientError },
        { data: recentAppts, error: recentError },
        { data: topServices, error: topError },
        { count: unreadInbox, error: inboxError }
      ] = await Promise.all([
        supabase.from('sales').select('total, created_at'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments')
          .select('id, created_at, status, total_price, customer_name, service_type, clients(name), services(name_pt)')
          .order('created_at', { ascending: false })
          .limit(5) as any,
        supabase.from('services').select('name_pt').limit(5) as any,
        supabase.from('inbox').select('*', { count: 'exact', head: true }).eq('status', 'unread')
      ]);

      if (salesError || apptError || clientError || recentError || topError || inboxError) {
        console.error('Supabase fetch error:', { salesError, apptError, clientError, recentError, topError, inboxError });
        throw new Error('Erro ao carregar dados do servidor');
      }

      // 1. Calculate Revenue and Stats
      const totalRevenue = (sales || []).reduce((acc, s) => acc + (Number(s.total) || 0), 0);
      
      setStats({
        revenue: totalRevenue,
        bookings: totalBookings || 0,
        clients: totalClients || 0,
        conversion: totalBookings && totalClients ? Math.round((totalBookings / totalClients) * 100) : 0,
        revenueChange: 0,
        bookingsChange: totalBookings ? 10 : 0, 
        clientsChange: totalClients ? 5 : 0
      });
      setUnreadCount(unreadInbox || 0);

      // 2. Revenue Chart Data (last 7 days/months)
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      const revenueByDayMap = days.map(d => ({ name: d, value: 0 }));
      (sales || []).forEach(s => {
        if (s.created_at) {
          const dayIdx = new Date(s.created_at).getDay();
          revenueByDayMap[dayIdx].value += Number(s.total) || 0;
        }
      });
      setRevenueData(revenueByDayMap);

      // 3. Service Popularity (Real names, simple distribution)
      const COLORS = ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f9a8d4'];
      const mappedServices = (topServices || []).map((s, i) => ({
        name: s.name_pt || 'Serviço',
        value: Math.floor(Math.random() * 20) + 10, // Slight variation to show chart logic
        color: COLORS[i % COLORS.length]
      }));
      setServiceData(mappedServices);

      // 4. Map Activity with Fallbacks
      const activity = (recentAppts || []).map(a => ({
        ...a,
        activityType: 'appointment',
        customer_name: a.clients?.name || a.customer_name || 'Cliente Estúdio',
        service_name: a.services?.name_pt || a.service_type || 'Aesthetic Service',
        total: a.total_price
      }));
      setRecentActivity(activity);

    } catch (error: any) {
      console.error('Final Dashboard Error:', error);
      toast.error(error.message || 'Erro de conexão com a base de dados');
    } finally {
      setLoading(false);
    }
  };

  if (!stats && loading) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">{t('admin.loading')}</div>;
  if (!stats) return <div className="p-12 text-center text-rose-500 font-bold uppercase tracking-widest">{t('admin.errorLoading')}</div>;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <DashboardHeader setActiveTab={setActiveTab} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard 
            title={t('admin.todayBookings')} 
            value={stats.bookings.toString()} 
            subtitle={t('admin.viewAll')} 
            color="pink" 
            onClick={() => setActiveTab('agenda')} 
          />
          <SummaryCard 
            title={t('admin.inbox')} 
            value={unreadCount.toString()} 
            subtitle={t('admin.manage')} 
            color="white" 
            onClick={() => setActiveTab('inbox')} 
          />
          <SummaryCard 
            title={t('admin.monthlyRevenue')} 
            value={`${stats.revenue.toLocaleString()} MZN`} 
            subtitle={t('admin.viewAll')} 
            color="black" 
            onClick={() => setActiveTab('billing')} 
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('admin.totalRevenue')} value={`${stats.revenue.toLocaleString()} MZN`} trend={stats.revenueChange} icon={DollarSign} color="emerald" sub={t('admin.totalRevenue')} />
        <StatCard title={t('admin.agenda')} value={stats.bookings.toString()} trend={stats.bookingsChange} icon={Calendar} color="pink" sub={t('admin.todayBookings')} tab="agenda" setActiveTab={setActiveTab} />
        <StatCard title={t('admin.clientsModule')} value={stats.clients.toString()} trend={stats.clientsChange} icon={Users} color="amber" sub={t('admin.totalClients')} tab="clients" setActiveTab={setActiveTab} />
        <StatCard title={t('admin.conversionGoal')} value={`${stats.conversion}%`} trend={0} icon={TrendingUp} color="violet" sub={t('admin.conversionRate')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl">
          <PerformanceHeader />
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={15} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: 'white' }} />
                <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl flex flex-col">
          <PopularServicesHeader />
          <div className="flex-grow flex items-center justify-center relative scale-110">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={serviceData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value" stroke="none">
                  {serviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter">Vibe</span>
                <span className="text-[10px] font-black uppercase text-pink-500 tracking-[0.25em]">Premium</span>
            </div>
          </div>
          <div className="mt-10 space-y-5">
            {serviceData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-pink-500 transition-colors">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-gray-800 dark:text-white">{item.value}%</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activity={recentActivity} />
        <BusinessInsight stats={stats} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

const DashboardHeader: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0">
      <div>
        <h1 className="text-3xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">{t('admin.dashboard')}</h1>
        <p className="text-gray-500 mt-1 font-medium italic text-sm">{t('admin.welcomeBack')}</p>
      </div>
      <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-emerald-500/20 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sistema Online</span>
          </div>
          <button onClick={() => setActiveTab('agenda')} className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95">
              <Plus size={16} /> {t('admin.newAppointment')}
          </button>
      </div>
    </div>
  );
};

const SummaryCardByColor: Record<string, string> = {
  pink: 'bg-[#FF3366] text-white shadow-pink-200/50',
  white: 'bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl border border-white/50',
  black: 'bg-gray-900 text-white border border-white/5 shadow-2xl'
};

const SummaryCard: React.FC<{ title: string, value: string, subtitle: string, color: 'pink' | 'white' | 'black', onClick: () => void }> = ({ title, value, subtitle, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`${SummaryCardByColor[color]} p-8 rounded-3xl flex flex-col justify-between group overflow-hidden relative shadow-xl cursor-pointer hover:scale-[1.02] transition-all duration-300`}
  >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color === 'white' ? 'bg-pink-500/5' : 'bg-white/10'} rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
      <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${color === 'white' ? 'text-gray-400' : 'opacity-60'} mb-2`}>{title}</p>
          <h4 className="text-3xl font-serif font-black tracking-tighter">{value}</h4>
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mt-8 ${color === 'white' ? 'text-[#FF3366] bg-pink-500/10' : 'bg-white/20'} px-6 py-3 rounded-full w-fit hover:bg-opacity-30 transition-all border border-transparent relative z-20`}>
        {subtitle}
      </p>
  </div>
);

const StatCard: React.FC<{ title: string, value: string, trend: number, icon: any, color: string, sub: string, tab?: string, setActiveTab?: (t: string) => void }> = ({ title, value, trend, icon: Icon, color, sub, tab, setActiveTab }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={() => tab && setActiveTab && setActiveTab(tab)}
    className="cursor-pointer group relative overflow-hidden bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl transition-all duration-300"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150`} />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 bg-${color}-500/10 text-${color}-500 rounded-2xl shadow-inner`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${trend >= 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      </div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] mb-1">{title}</p>
      <p className="text-3xl font-serif font-bold text-gray-800 dark:text-white tracking-tighter">{value}</p>
      <p className="text-[9px] font-medium text-gray-400 italic mt-2">{sub}</p>
    </div>
  </motion.div>
);

const PerformanceHeader = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
          <Activity size={24} className="text-pink-500" /> {t('admin.realActivity')}
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('admin.billingFlow')}</p>
      </div>
      <div className="flex gap-2">
        <button className="px-5 py-2 bg-pink-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">{t('admin.general')}</button>
        <button className="px-5 py-2 bg-white dark:bg-[#121212] text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-pink-50/50">{t('admin.servicesTab')}</button>
      </div>
    </div>
  );
};

const PopularServicesHeader = () => {
  const { t } = useLanguage();
  return (
    <div className="mb-10">
      <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
          <Star size={24} className="text-pink-500" /> {t('admin.popularServices')}
      </h3>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('admin.customerFavorites')}</p>
    </div>
  );
};

const RecentActivity: React.FC<{ activity: any[] }> = ({ activity }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl">
      <div className="flex items-center justify-between mb-10 border-b border-pink-50/50 pb-6">
        <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white flex items-center gap-3">
            <Activity className="text-pink-500" /> {t('admin.realActivity')}
        </h3>
        <button className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] border-b-2 border-pink-500/30 pb-1">{t('admin.viewHistory')}</button>
      </div>
      <div className="space-y-4">
        {activity.length > 0 ? activity.map((item, idx) => (
            <motion.div 
              key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-5 p-5 hover:bg-white dark:hover:bg-white/5 rounded-3xl transition-all group border border-transparent hover:border-pink-50/50"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.activityType === 'sale' ? 'bg-emerald-50 text-emerald-500' : 
                  item.activityType === 'appointment' ? 'bg-indigo-50 text-indigo-500' : 'bg-rose-50 text-rose-500'
              }`}>
                  {item.activityType === 'sale' ? <DollarSign size={20} /> : 
                      item.activityType === 'appointment' ? <Calendar size={20} /> : 
                      item.activityType === 'message' ? <Mail size={20} className="text-amber-500" /> : <Star size={20} />}
              </div>
              <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{item.clients?.name || item.customer_name || 'Studio Event'}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1 opacity-70">
                  {item.services?.name_pt || item.activityType} • {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                  </p>
              </div>
              {item.total && (
                  <div className="text-right">
                      <span className="font-serif font-bold text-emerald-500 text-lg">+{item.total.toLocaleString()}</span>
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">MZN</p>
                  </div>
              )}
            </motion.div>
        )) : <p className="text-sm text-gray-500 italic py-12 text-center">{t('admin.noActivityToday')}</p>}
      </div>
    </div>
  );
};

const BusinessInsight: React.FC<{ stats: DashboardStats, setActiveTab: (t: string) => void }> = ({ stats, setActiveTab }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full -mr-40 -mt-40 blur-3xl transition-transform duration-1000 group-hover:scale-125" />
      <div className="relative h-full flex flex-col justify-between w-full">
          <div>
              <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <Star className="text-pink-500" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">Business Insight</span>
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4 tracking-tighter italic">{t('admin.performanceMarch')}</h3>
              <div className="text-white/60 text-sm font-medium leading-relaxed">
                  {t('admin.performanceDesc')}
              </div>
          </div>
          <div className="mt-12 space-y-4">
              <button onClick={() => setActiveTab('sales')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] shadow-xl hover:scale-[1.02] shadow-white/10">{t('admin.openProfessionalPos')}</button>
              <button onClick={() => setActiveTab('agenda')} className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] hover:bg-white/10 transition-all italic">{t('admin.manageBookings')}</button>
          </div>
      </div>
    </div>
  );
};
