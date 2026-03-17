import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    appointments: 0,
    customers: 845,
    conversion: 12
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // In a real app, these would be complex aggregation queries
    // For now we fetch counts from our tables
    const { count: apptCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
    const { data: salesData } = await supabase.from('sales').select('total');
    
    const totalRev = salesData?.reduce((acc, curr) => acc + curr.total, 0) || 0;

    setStats(prev => ({
      ...prev,
      revenue: totalRev,
      appointments: apptCount || 0
    }));

    // Fetch recent sales for activity
    const { data: recentSales } = await supabase
      .from('sales')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(5);
    
    setRecentActivity(recentSales || []);
  };

  const statCards = [
    { title: 'Receita Total', value: `${stats.revenue.toLocaleString()} MZN`, icon: DollarSign, trend: '+12.5%', isUp: true },
    { title: 'Marcações', value: stats.appointments.toString(), icon: Calendar, trend: '+5.2%', isUp: true },
    { title: 'Novos Clientes', value: stats.customers.toString(), icon: Users, trend: '-2.1%', isUp: false },
    { title: 'Taxa de Conversão', value: `${stats.conversion}%`, icon: TrendingUp, trend: '+1.5%', isUp: true },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-xl shadow-pink-100/20 hover:shadow-pink-200/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full -mr-12 -mt-12 group-hover:bg-pink-100 transition-colors" />
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-pink-50 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform">
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold font-sans ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
              <p className="text-3xl font-serif font-bold text-gray-800 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-pink-100 shadow-xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-pink-50">
            <h3 className="text-2xl font-serif text-gray-800">Atividade Recente</h3>
            <button className="text-pink-500 text-sm font-bold hover:underline font-sans">Ver Tudo</button>
          </div>
          <div className="space-y-6">
            {recentActivity.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-sans italic">Nenhuma atividade recente.</div>
            ) : recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-6 rounded-3xl bg-neutral-50 border border-transparent hover:border-pink-50 hover:bg-white transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-pink-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Venda de Balcão</p>
                    <p className="text-sm text-gray-400 font-sans">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="font-bold text-pink-600 font-sans text-xl">{activity.total.toLocaleString()} MZN</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all" />
          <h3 className="text-2xl font-serif mb-8 relative">Meta Mensal</h3>
          <div className="space-y-8 relative">
            <div>
              <div className="flex justify-between text-sm font-bold mb-3 uppercase tracking-tighter">
                <span className="opacity-80">Progresso de Vendas</span>
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
              <p className="text-sm opacity-60 font-sans uppercase tracking-widest font-bold">Total este Mês</p>
            </div>
            <button className="w-full py-4 bg-white text-pink-600 rounded-2xl font-bold hover:bg-pink-50 transition-colors uppercase tracking-widest text-xs shadow-xl shadow-pink-900/20">
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
