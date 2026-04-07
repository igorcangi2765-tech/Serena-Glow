import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../LanguageContext';
import { X, User, Phone, Mail, Clock, MessageSquare, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomDatePicker from './common/CustomDatePicker';
import CustomTimePicker from './common/CustomTimePicker';
import CustomSelect from './common/CustomSelect';
import { supabase } from '../lib/supabase';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
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
      setValidationError(null);
      setSubmitted(false);
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) throw error;
      setDbServices(data || []);
    } catch (err: any) {
      console.error('Error fetching services:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialService && dbServices.length > 0) {
      // 1. Try to find by UUID
      const serviceById = dbServices.find(s => s.id === initialService);
      if (serviceById) {
        setFormData(prev => ({ ...prev, service: language === 'pt' ? serviceById.name_pt : serviceById.name_en }));
      } else {
        // 2. Fallback to name matching
        setFormData(prev => ({ ...prev, service: initialService }));
      }
    } else if (!initialService) {
      // 3. Reset if no initial service (e.g. opened from header)
      setFormData(prev => ({ ...prev, service: '' }));
    }
  }, [initialService, isOpen, dbServices, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError(null);
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, date }));
    if (validationError) setValidationError(null);
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Prevent HTML default form submission (reload)
    if (e) e.preventDefault();
    setSubmitted(true);

    // 2. Validation Check
    const requiredFields = ['name', 'phone', 'service', 'date', 'time'] as const;
    const isMissingFields = requiredFields.some(field => !formData[field]);

    if (isMissingFields) {
      setValidationError(t('booking.errorRequired') || 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // 3. Prevent duplicate submissons
    if (submitting) return;
    setSubmitting(true);
    setValidationError(null);

    try {
        // 4. Resolve Service ID (matching selection with backend services)
        const selectedService = dbServices.find(s => 
            (language === 'pt' ? s.name_pt : s.name_en) === formData.service
        );

        // Fallback to initial service ID if name matching fails (e.g. for packages)
        const serviceId = selectedService?.id || initialService;

        if (!serviceId) {
            throw new Error('Serviço não selecionado');
        }

        // 5. Get/Verify client data directly from Supabase
        let { data: client, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('phone', formData.phone)
          .maybeSingle();

        if (clientError) throw clientError;

        if (!client) {
          // Create new client if doesn't exist
          const { data: newClient, error: insertError } = await supabase
            .from('clients')
            .insert({
              name: formData.name,
              phone: formData.phone,
              email: formData.email || null
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          client = newClient;
        }

        // 6. Submit the booking request
        const appointmentData = {
            customer_id: client?.id,
            service_id: serviceId,
            appointment_date: formData.date,
            appointment_time: formData.time,
            status: 'pending',
            notes: formData.notes
        };

        console.log('📤 Enviando pedido de agendamento:', appointmentData);
        const { error: bookingError } = await supabase
          .from('appointments')
          .insert(appointmentData);

        if (bookingError) throw bookingError;

        // 7. Success handling
        toast.success(t('booking.success'));
        console.log('✅ Agendamento realizado com sucesso!');
        
        // Reset form data BEFORE closing to avoid stale data on next open
        setFormData({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
        setSubmitted(false);
        setValidationError(null);
        
        // Only close the modal on success
        onClose();
    } catch (err: any) {
        console.error('❌ Erro na submissão:', err.message);
        toast.error(t('booking.error') || 'Erro ao realizar marcação. Por favor, tente novamente.');
    } finally {
        setSubmitting(false);
    }
  };

  // Hardcoded beauty packages for consistent dropdown selection
  const hardcodedPackages = language === 'pt' 
    ? ['Essencial', 'Beleza Completa', 'Beleza Premium']
    : ['Essential', 'Complete Beauty', 'Premium Beauty'];

  // Combine DB services with static packages
  const allServiceOptions = [
    ...hardcodedPackages,
    ...dbServices.map(s => language === 'pt' ? s.name_pt : s.name_en)
  ];

  const getInputClass = (value: string, isError: boolean = false) => {
    const baseClass = "w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 font-sans transition-all duration-300 placeholder:text-gray-400";
    const statusClass = submitted && !value
      ? "border-red-400 dark:border-red-500/50 bg-red-50/10 focus:ring-red-400/20 focus:border-red-400"
      : "border-pink-100 dark:border-[#2E2E2E] focus:ring-pink-400/20 focus:border-pink-400 bg-pink-50/30 dark:bg-[#121212] dark:text-[#EAEAEA]";
    
    return `${baseClass} ${statusClass}`;
  };

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
                      className={getInputClass(formData.name)}
                    />
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.phone')}</label>
                    <Phone className="absolute left-4 top-[42px] text-pink-400 pointer-events-none" size={18} />
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      placeholder={t('booking.phonePlaceholder')}
                      className={getInputClass(formData.phone)}
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
                    className={getInputClass(formData.email || 'skip')} // Email is optional
                  />
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                  <label htmlFor="modal-service" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.service')}</label>
                  <div className={`rounded-2xl transition-all duration-300 ${submitted && !formData.service ? 'ring-2 ring-red-400/20' : ''}`}>
                    <CustomSelect
                      value={formData.service}
                      onChange={(val) => setFormData({ ...formData, service: val })}
                      options={allServiceOptions}
                      placeholder={loading ? 'Carregando...' : t('booking.selectService')}
                      error={submitted && !formData.service}
                    />
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.date')}</label>
                    <div className={`rounded-2xl transition-all duration-300 ${submitted && !formData.date ? 'ring-2 ring-red-400/20' : ''}`}>
                      <CustomDatePicker 
                        value={formData.date} 
                        onChange={handleDateChange} 
                        label={t('booking.selectDate')}
                        error={submitted && !formData.date}
                      />
                    </div>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.time')}</label>
                    <div className={`rounded-2xl transition-all duration-300 ${submitted && !formData.time ? 'ring-2 ring-red-400/20' : ''}`}>
                      <CustomTimePicker
                        value={formData.time}
                        onChange={handleTimeChange}
                        label={t('booking.selectTime')}
                        error={submitted && !formData.time}
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-[#A0A0A0] mb-2 ml-1">{t('booking.notes')}</label>
                  <MessageSquare className="absolute left-4 top-[42px] text-pink-400/60 pointer-events-none" size={18} />
                  <textarea
                    id="notes" name="notes"
                    value={formData.notes} onChange={handleChange}
                    placeholder={t('booking.notesPlaceholder')}
                    rows={3} className={getInputClass('skip') + ' resize-none'} // Notes is optional
                  />
                </motion.div>

                <div className="pt-4">
                  <AnimatePresence>
                    {validationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {validationError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -10px rgba(244, 63, 94, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4.5 rounded-2xl font-bold tracking-[0.11em] text-sm shadow-xl shadow-pink-100 dark:shadow-none transition-all duration-300 flex items-center justify-center gap-3 group ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <Send size={18} className={submitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'} />
                    {submitting ? 'A processar...' : t('booking.confirm')}
                  </motion.button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
