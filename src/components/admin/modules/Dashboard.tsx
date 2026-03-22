import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Clock, FileText } from 'lucide-react';
import { generateStudioReport } from '@/lib/reports';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/LanguageContext';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    revenue: 0,
    appointments: 0,
    customers: 0,
    conversion: 12
  });
  const [targetConversion, setTargetConversion] = useState(15);
  const [isEditingConversion, setIsEditingConversion] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts and totals
      const { count: apptCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
      const { data: salesData } = await supabase.from('sales').select('total');
      const { data: clientData } = await supabase.from('appointments').select('customer_phone');
      
      const totalRev = salesData?.reduce((acc, curr) => acc + curr.total, 0) || 0;
      const uniqueClientsCount = new Set(clientData?.map(c => c.customer_phone)).size;

      setStats(prev => ({
        ...prev,
        revenue: totalRev,
        appointments: apptCount || 0,
        customers: uniqueClientsCount || 0
      }));

      // Fetch recent sales, appointments, and notifications for a combined activity feed
      const [salesRes, apptsRes, notifsRes] = await Promise.all([
        supabase.from('sales').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('appointments').select('*, services(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      const combinedActivity = [
        ...(salesRes.data || []).map(s => ({ ...s, activityType: 'sale' })),
        ...(apptsRes.data || []).map(a => ({ ...a, activityType: 'appointment' })),
        ...(notifsRes.data || []).map(n => ({ ...n, activityType: 'notification' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 8);
      
      setRecentActivity(combinedActivity);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statCards = [
    { title: t('admin.totalRevenue'), value: `${stats.revenue.toLocaleString()} MZN`, icon: DollarSign, trend: '+12.5%', isUp: true },
    { title: t('admin.agenda'), value: stats.appointments.toString(), icon: Calendar, trend: '+5.2%', isUp: true, tab: 'agenda' },
    { title: t('admin.newClients'), value: stats.customers.toString(), icon: Users, trend: '-2.1%', isUp: false, tab: 'clients' },
    { title: t('admin.conversionRate'), value: `${stats.conversion}%`, icon: TrendingUp, trend: '+1.5%', isUp: true },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => stat.tab && setActiveTab(stat.tab)}
            className={`bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-xl shadow-pink-100/20 hover:shadow-pink-200/30 transition-all group overflow-hidden relative ${stat.tab ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full -mr-12 -mt-12 group-hover:bg-pink-100 transition-colors" />
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-pink-50 rounded-2xl text-pink-500 group-hover:scale-105 transition-transform">
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold font-sans ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-serif font-bold text-gray-800 tracking-tighter">{stat.value}</p>
                {stat.title.includes('Conversão') && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingConversion(true);
                    }}
                    className="p-1 hover:bg-pink-50 rounded-lg transition-colors text-pink-400"
                  >
                    <TrendingUp size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isEditingConversion && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full border border-pink-50">
              <h4 className="text-xl font-serif text-gray-800 mb-4">{t('admin.conversionGoal')}</h4>
              <p className="text-gray-500 text-sm mb-6 font-sans">{t('admin.adjustGoalDesc')}</p>
              <input 
                type="number" 
                value={targetConversion}
                onChange={(e) => setTargetConversion(Number(e.target.value))}
                className="w-full p-4 bg-pink-50 rounded-2xl border-2 border-transparent focus:border-pink-500 outline-none mb-6 text-2xl font-bold text-center"
              />
              <button 
                onClick={() => setIsEditingConversion(false)}
                className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-colors"
              >
                {t('admin.saveChanges')}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-pink-100 shadow-xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-pink-50">
            <h3 className="text-2xl font-serif text-gray-800">{t('admin.recentActivity')}</h3>
            <button 
              onClick={() => setActiveTab('agenda')}
              className="text-pink-500 text-sm font-bold hover:underline font-sans"
            >
              {t('admin.viewAll')}
            </button>
          </div>
          <div className="space-y-6">
            {recentActivity.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-sans italic">{t('admin.noRecentActivity')}</div>
            ) : recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-6 rounded-3xl bg-neutral-50 border border-transparent hover:border-pink-50 hover:bg-white transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${
                    activity.activityType === 'sale' ? 'text-emerald-500' : 
                    activity.activityType === 'notification' ? 'text-amber-500' : 'text-pink-500'
                  }`}>
                    {activity.activityType === 'sale' ? <DollarSign size={24} /> : 
                     activity.activityType === 'notification' ? <Clock size={24} /> : <Calendar size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {activity.activityType === 'sale' ? t('admin.posSale') : 
                       activity.activityType === 'notification' ? activity.title : t('admin.newAppointment')}
                    </p>
                    <p className="text-sm text-gray-400 font-sans">
                      {activity.activityType === 'sale' 
                        ? (activity.clients?.name || 'Venda Rápida')
                        : activity.activityType === 'notification'
                        ? activity.message
                        : `${activity.customer_name} - ${activity.services?.name}`
                      } • {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className={`font-bold font-sans text-xl ${
                  activity.activityType === 'sale' ? 'text-emerald-600' : 
                  activity.activityType === 'notification' ? 'text-amber-600' : 'text-pink-600'
                }`}>
                  {activity.activityType === 'sale' 
                    ? `${activity.total.toLocaleString()} MZN`
                    : activity.activityType === 'notification'
                    ? (activity.type === 'booking' ? t('admin.agenda').toUpperCase() : t('admin.notification').toUpperCase() || 'ALERTA')
                    : t('admin.scheduled')
                  }
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all" />
          <h3 className="text-2xl font-serif mb-8 relative">{t('admin.monthlyGoal')}</h3>
          <div className="space-y-8 relative">
            <div>
              <div className="flex justify-between text-sm font-bold mb-3 uppercase tracking-tighter">
                <span className="opacity-80">{t('admin.salesProgress')}</span>
                <span>{Math.round((stats.revenue / 250000) * 100)}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden p-1">
                <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((stats.revenue / 250000) * 100, 100)}%` }} 
                />
              </div>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-4xl font-serif font-bold mb-1 tracking-tighter">{stats.revenue.toLocaleString()} MZN</p>
              <p className="text-sm opacity-60 font-sans uppercase tracking-widest font-bold">{t('admin.totalThisMonth')}</p>
            </div>
            <button 
              onClick={() => generateStudioReport({
                totalRevenue: stats.revenue,
                totalAppointments: stats.appointments,
                totalClients: stats.customers,
                recentActivity: recentActivity
              })}
              className="w-full py-4 bg-white text-pink-600 rounded-2xl font-bold hover:bg-pink-50 transition-colors uppercase tracking-widest text-xs shadow-xl shadow-pink-900/20"
            >
              {t('admin.generateReport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
