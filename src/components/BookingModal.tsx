import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../LanguageContext';
import { X, User, Phone, Mail, Clock, MessageSquare, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomDatePicker from './common/CustomDatePicker';
import CustomTimePicker from './common/CustomTimePicker';
import CustomSelect from './common/CustomSelect';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialService }) => {
  const { t, language } = useLanguage();
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('name_pt');
      if (error) throw error;
      setDbServices(data || []);
    } catch (err: any) {
      console.error('Error fetching services:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialService && dbServices.length > 0) {
      // 1. Try to find by UUID
      const serviceById = dbServices.find(s => s.id === initialService);
      if (serviceById) {
        setFormData(prev => ({ ...prev, service: language === 'pt' ? serviceById.name_pt : serviceById.name_en }));
      } else {
        // 2. Fallback to name matching
        setFormData(prev => ({ ...prev, service: initialService }));
      }
    }
  }, [initialService, isOpen, dbServices, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
        // 1. Resolve Service ID (matching by name since CustomSelect returns string)
        const selectedService = dbServices.find(s => 
            (language === 'pt' ? s.name_pt : s.name_en) === formData.service
        );

        if (!selectedService && !initialService) {
            throw new Error('Serviço não reconhecido');
        }

        const serviceId = selectedService?.id || initialService;

        // 2. Get or create client
        const { data: clientData } = await supabase
            .from('clients')
            .select('id')
            .eq('phone', formData.phone)
            .maybeSingle();
        
        let customerId = clientData?.id;

        if (!customerId) {
            const { data: newClient, error: createError } = await supabase
                .from('clients')
                .insert([{ name: formData.name, phone: formData.phone, email: formData.email }])
                .select()
                .single();
            if (createError) throw createError;
            customerId = newClient.id;
        }

        // 3. Submit appointment
        const appointmentData = {
            customer_id: customerId,
            service_id: serviceId,
            appointment_date: formData.date,
            appointment_time: formData.time,
            status: 'pending',
            notes: formData.notes
        };

        await api.post('/bookings', appointmentData);

        toast.success(t('booking.success'));
        onClose();
        setFormData({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
    } catch (err: any) {
        console.error('Booking error:', err.message);
        toast.error(t('booking.error') || 'Erro ao realizar marcação');
    } finally {
        setSubmitting(false);
    }
  };

  const services = t('booking.services') || [];

  const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-xl border border-pink-100 dark:border-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-pink-400/20 focus:border-pink-400 bg-pink-50/30 dark:bg-[#121212] dark:text-[#EAEAEA] font-sans transition-all duration-300 placeholder:text-gray-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-pink-900/10 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-pink-50 dark:border-[#2E2E2E] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-400 hover:text-pink-500 transition-all duration-300 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-10 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="text-center mb-10 md:mb-14">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mb-3 tracking-tight">
                  {t('booking.title')}
                </h2>
                <p className="text-gray-500 dark:text-[#A0A0A0] text-sm md:text-base font-sans font-light">
                  {t('services.intro')}
                </p>
              </div>

              <motion.form
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.name')}</label>
                    <User className="absolute left-4 top-[42px] text-pink-400 pointer-events-none" size={18} />
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      placeholder={t('booking.namePlaceholder')}
                      required className={inputClass}
                    />
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.phone')}</label>
                    <Phone className="absolute left-4 top-[42px] text-pink-400 pointer-events-none" size={18} />
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      placeholder={t('booking.phonePlaceholder')}
                      required className={inputClass}
                    />
                  </motion.div>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.email')}</label>
                  <Mail className="absolute left-4 top-[42px] text-pink-400 pointer-events-none" size={18} />
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder={t('booking.emailPlaceholder')}
                    required className={inputClass}
                  />
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                  <label htmlFor="modal-service" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.service')}</label>
                  <CustomSelect
                    value={formData.service}
                    onChange={(val) => setFormData({ ...formData, service: val })}
                    options={dbServices.map(s => language === 'pt' ? s.name_pt : s.name_en)}
                    placeholder={loading ? 'Carregando...' : t('booking.selectService')}
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.date')}</label>
                    <CustomDatePicker 
                      value={formData.date} 
                      onChange={handleDateChange} 
                      label={t('booking.selectDate')}
                    />
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.time')}</label>
                    <CustomTimePicker
                      value={formData.time}
                      onChange={(val) => setFormData({ ...formData, time: val })}
                      label={t('booking.selectTime')}
                    />
                  </motion.div>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.notes')}</label>
                  <MessageSquare className="absolute left-4 top-[42px] text-pink-400/60 pointer-events-none" size={18} />
                  <textarea
                    id="notes" name="notes"
                    value={formData.notes} onChange={handleChange}
                    placeholder={t('booking.notesPlaceholder')}
                    rows={3} className={inputClass + ' resize-none'}
                  />
                </motion.div>

                <motion.button
                  variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                  whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -10px rgba(244, 63, 94, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4.5 rounded-2xl font-bold tracking-[0.11em] text-sm shadow-xl shadow-pink-100 dark:shadow-none transition-all duration-300 mt-4 flex items-center justify-center gap-3 group ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <Send size={18} className={submitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'} />
                  {submitting ? 'A processar...' : t('booking.confirm')}
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
