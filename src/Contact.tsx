import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t.contact.success);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="pt-24 w-full bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 mb-4 tracking-wide">{t.contact.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg">{t.contact.intro}</p>
          <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="bg-white p-10 rounded-2xl shadow-md border border-pink-50">
              <h2 className="text-3xl font-serif text-gray-800 mb-8">{t.contact.infoTitle}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 uppercase tracking-wider mb-1 font-sans">{t.contact.address}</h3>
                    <p className="text-gray-600 font-sans whitespace-pre-line">{t.contact.addressValue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 uppercase tracking-wider mb-1 font-sans">{t.contact.phone}</h3>
                    <p className="text-gray-600 font-sans tracking-wide">{t.contact.phoneValue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 uppercase tracking-wider mb-1 font-sans">{t.contact.email}</h3>
                    <p className="text-gray-600 font-sans">{t.contact.emailValue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 uppercase tracking-wider mb-1 font-sans">{t.contact.hours}</h3>
                    <p className="text-gray-600 font-sans whitespace-pre-line">{t.contact.hoursValue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-80 bg-pink-50 rounded-2xl overflow-hidden relative border border-pink-100">
              <div className="absolute inset-0 flex items-center justify-center text-pink-300 font-medium tracking-widest uppercase font-sans">
                Google Maps Embed
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-2xl shadow-md border border-pink-50">
            <h2 className="text-3xl font-serif text-gray-800 mb-8">{t.contact.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t.contact.form.name}</label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t.contact.form.phone}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t.contact.form.email}</label>
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
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2 font-sans">{t.contact.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 resize-none font-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-full font-medium tracking-wide hover:shadow-lg transition-shadow shadow-md mt-4 font-sans"
              >
                {t.contact.form.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
