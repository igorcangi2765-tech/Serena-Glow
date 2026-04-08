import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../LanguageContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { api } from '../lib/api';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/inbox', formData);
      toast.success(t('contact.success'));
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 w-full bg-neutral-50 dark:bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-4 tracking-wide">{t('contact.title')}</h1>
          <p className="text-gray-600 dark:text-[#A0A0A0] max-w-2xl mx-auto mb-6 text-lg">{t('contact.intro')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="bg-white dark:bg-[#1E1E1E] p-6 md:p-10 rounded-2xl shadow-md border border-pink-50 dark:border-[#2E2E2E]">
              <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-8">{t('contact.infoTitle')}</h2>
              <div className="space-y-6">
                {[
                  { icon: <MapPin className="w-6 h-6 text-pink-500 transition-colors duration-300 group-hover:text-white" />, label: t('contact.address'), value: settings?.address || t('contact.addressValue') },
                  { icon: <Phone className="w-6 h-6 text-pink-500 transition-colors duration-300 group-hover:text-white" />, label: t('contact.phone'), value: settings?.phone || t('contact.phoneValue') },
                  { icon: <Mail className="w-6 h-6 text-pink-500 transition-colors duration-300 group-hover:text-white" />, label: t('contact.email'), value: settings?.email || t('contact.emailValue') },
                  { icon: <Clock className="w-6 h-6 text-pink-500 transition-colors duration-300 group-hover:text-white" />, label: t('contact.hours'), value: t('contact.hoursValue') }, // Hours usually still in translation
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-pink-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-pink-200">
                      {item.icon}
                    </div>
                    <div className="transition-transform duration-300 group-hover:translate-x-1">
                      <h3 className="font-bold text-gray-800 dark:text-[#EAEAEA] uppercase tracking-wider mb-1 font-sans">{item.label}</h3>
                      <p className="text-gray-600 dark:text-[#A0A0A0] font-sans whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-80 bg-pink-50 dark:bg-[#1E1E1E] rounded-2xl overflow-hidden relative border border-pink-100 dark:border-[#2E2E2E]">
              <div className="absolute inset-0 flex items-center justify-center text-pink-300 dark:text-pink-700 font-medium tracking-widest uppercase font-sans text-center px-4">
                {t('contact.mapPlaceholder')}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 md:p-10 rounded-2xl shadow-md border border-pink-50 dark:border-[#2E2E2E] w-full hover:shadow-lg transition-all duration-300">
            <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-8">{t('contact.formTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] uppercase tracking-wider mb-2 font-sans">{t('contact.form.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full h-14 px-4 rounded-xl border border-pink-200 dark:border-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 dark:bg-[#121212] dark:text-[#EAEAEA] font-sans"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] uppercase tracking-wider mb-2 font-sans">{t('contact.form.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-14 px-4 rounded-xl border border-pink-200 dark:border-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 dark:bg-[#121212] dark:text-[#EAEAEA] font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] uppercase tracking-wider mb-2 font-sans">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-4 rounded-xl border border-pink-200 dark:border-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 dark:bg-[#121212] dark:text-[#EAEAEA] font-sans"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] uppercase tracking-wider mb-2 font-sans">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full h-48 px-4 py-4 rounded-xl border border-pink-200 dark:border-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 dark:bg-[#121212] dark:text-[#EAEAEA] resize-none font-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-10 rounded-xl font-medium tracking-wide shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2 font-sans active:scale-95"
              >
                {t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
