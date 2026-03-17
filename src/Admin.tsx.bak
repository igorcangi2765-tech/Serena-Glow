import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { Users, Calendar, Scissors, DollarSign, Search, Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert(t.admin.invalidPassword);
    }
  };

  const stats = [
    { title: t.admin.bookings, value: '12', icon: <Calendar className="w-6 h-6 text-pink-500" /> },
    { title: t.admin.clients, value: '845', icon: <Users className="w-6 h-6 text-pink-500" /> },
    { title: t.admin.services, value: '32', icon: <Scissors className="w-6 h-6 text-pink-500" /> },
    { title: t.admin.revenue, value: '4,250€', icon: <DollarSign className="w-6 h-6 text-pink-500" /> },
  ];

  const recentBookings = [
    { id: 1, client: 'Ana Silva', service: 'Limpeza de Pele', date: t.admin.today, time: '14:30', status: 'confirmed' },
    { id: 2, client: 'Maria Santos', service: 'Corte e Brushing', date: t.admin.today, time: '16:00', status: 'pending' },
    { id: 3, client: 'Joana Costa', service: 'Massagem Relax', date: t.admin.tomorrow, time: '10:00', status: 'confirmed' },
    { id: 4, client: 'Beatriz Lima', service: 'Manicure Gelinho', date: t.admin.tomorrow, time: '11:30', status: 'cancelled' },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-md border border-pink-100 max-w-md w-full">
          <h1 className="text-3xl font-serif text-gray-800 mb-8 text-center">{t.admin.login}</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t.admin.passwordLabel}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
                placeholder={t.admin.passwordPlaceholder}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-full font-medium tracking-wide hover:shadow-lg transition-shadow shadow-md font-sans"
            >
              {t.admin.enter}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 w-full bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif text-gray-800">{t.admin.dashboard}</h1>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="text-sm font-medium text-gray-600 uppercase tracking-wider hover:text-pink-600 transition-colors font-sans"
          >
            {t.admin.logout}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 font-sans">{stat.title}</p>
                <p className="text-2xl font-serif font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
          <div className="p-8 border-b border-pink-100 flex justify-between items-center">
            <h2 className="text-2xl font-serif text-gray-800">{t.admin.manageBookings}</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder={t.admin.search}
                className="pl-10 pr-4 py-2 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 text-sm w-64 font-sans"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50/50 text-gray-600 text-xs uppercase tracking-wider font-sans">
                  <th className="p-4 font-medium">{t.admin.client}</th>
                  <th className="p-4 font-medium">{t.admin.service}</th>
                  <th className="p-4 font-medium">{t.admin.date}</th>
                  <th className="p-4 font-medium">{t.admin.time}</th>
                  <th className="p-4 font-medium">{t.admin.status}</th>
                  <th className="p-4 font-medium text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{booking.client}</td>
                    <td className="p-4 text-gray-600">{booking.service}</td>
                    <td className="p-4 text-gray-600">{booking.date}</td>
                    <td className="p-4 text-gray-600">{booking.time}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                        {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                        {booking.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {booking.status === 'confirmed' ? t.admin.confirmed : booking.status === 'pending' ? t.admin.pending : t.admin.cancelled}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-pink-500 transition-colors mr-3" title={t.admin.edit}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors" title={t.admin.delete}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-pink-100 text-center">
            <button className="text-sm font-medium text-pink-600 uppercase tracking-wider hover:text-pink-700 transition-colors font-sans">
              {t.admin.viewAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
