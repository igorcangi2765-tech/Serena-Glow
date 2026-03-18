import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/LanguageContext';
import { useLocation } from 'react-router-dom';

export const Booking: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    alert(t('booking.success'));
    setFormData({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
  };

  const services = t('booking.services');

  return (
    <div className="pt-24 w-full bg-pink-50/50 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white p-6 md:p-16 rounded-3xl shadow-xl border border-pink-100">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800 mb-4 tracking-wide">{t('booking.title')}</h1>
            <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.service')}</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 appearance-none font-sans"
              >
                <option value="" disabled>{t('booking.selectService')}</option>
                {services.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.date')}</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.time')}</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t('booking.notes')}</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-10 rounded-full font-medium tracking-wide hover:shadow-lg transition-shadow shadow-md mt-8 font-sans"
            >
              {t('booking.confirm')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
