import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, Search, Filter, CheckCircle2, AlertCircle, FileText, Eye, Sparkles, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { format, startOfWeek, addDays, startOfDay, addHours, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { generateInvoicePDF } from '@/lib/billing';
import { Modal } from '../Modal';
import { useLanguage } from '@/LanguageContext';

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_price: number;
  services?: { name_pt: string; name_en: string };
}

export const Agenda: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();
  const currentLocale = language === 'pt' ? pt : undefined;
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [newBooking, setNewBooking] = useState({
    customer_id: '',
    service_id: '',
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    appointment_time: '09:00',
    total_price: 0
  });

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i));
  const times = Array.from({ length: 11 }).map((_, i) => format(addHours(startOfDay(new Date()), 8 + i), 'HH:00'));

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const from = format(days[0], 'yyyy-MM-dd');
      const to = format(days[6], 'yyyy-MM-dd');
      
      const [appts, svcs, clis] = await Promise.all([
        api.get(`/bookings?from=${from}&to=${to}`),
        api.get('/services'),
        api.get('/clients')
      ]);
      
      setAppointments(appts || []);
      setServices(svcs || []);
      setClients(clis || []);
    } catch (error: any) {
      console.error('Agenda Load Error:', error);
      toast.error(`Erro ao carregar agenda: ${error?.message || 'Erro de ligação'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bookings', newBooking);
      toast.success('Marcação criada com sucesso');
      setIsBookingModalOpen(false);
      fetchAppointments();
      setNewBooking({
        customer_id: '',
        service_id: '',
        appointment_date: format(new Date(), 'yyyy-MM-dd'),
        appointment_time: '09:00',
        total_price: 0
      });
    } catch (error: any) {
      toast.error('Erro ao criar marcação');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      toast.success(`Marcação ${newStatus} com sucesso`);
      fetchAppointments();
    } catch (error: any) {
      toast.error('Erro ao atualizar estado');
    }
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setNewBooking(prev => ({ 
      ...prev, 
      service_id: serviceId,
      total_price: service ? service.price : 0
    }));
  };

  const handleInvoiceAction = (appt: Appointment, action: 'download' | 'preview') => {
    const url = generateInvoicePDF({
      customer_name: appt.customer_name,
      doc_number: `INV-${appt.id.slice(0, 8)}`,
      type: 'Fatura',
      total: appt.total_price || 0,
      date: new Date().toISOString(),
      services: [language === 'pt' ? (appt.services?.name_pt || 'Serviço Estético') : (appt.services?.name_en || 'Aesthetic Service')]
    }, action);

    if (action === 'preview' && url) {
      setPreviewUrl(url.toString());
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Agenda</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic text-sm">Visualize e organize as marcações do dia</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-pink-100/50 dark:border-white/5 p-1">
                <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-3 text-gray-400 hover:text-pink-500 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="px-6 py-2 text-sm font-black uppercase tracking-widest text-gray-700 dark:text-white bg-white/60 dark:bg-white/10 rounded-xl shadow-sm">
                    {format(days[0], 'dd MMM', { locale: currentLocale })} - {format(days[6], 'dd MMM', { locale: currentLocale })}
                </div>
                <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-3 text-gray-400 hover:text-pink-500 transition-colors">
                    <ChevronRight size={20} />
                </button>
             </div>

             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Filtrar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-pink-100/30 dark:border-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-sans text-sm w-full md:w-64 shadow-inner"
                />
             </div>

             <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 relative z-20"
              >
                <Plus size={16} /> + Nova Marcação
              </button>
        </div>
      </div>

      <div className="flex-grow bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col relative">
        {loading && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-[100] flex items-center justify-center font-serif italic text-gray-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Consultando Agenda...</span>
                </div>
            </div>
        )}

        <div className="grid grid-cols-8 border-b border-pink-50/50 dark:border-white/5 bg-white/40 dark:bg-white/5 sticky top-0 z-50">
          <div className="p-6 border-r border-pink-50/50 dark:border-white/5" />
          {days.map(day => (
            <div key={day.toString()} className="p-6 text-center border-r border-pink-50/50 dark:border-white/5 last:border-0 italic">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{format(day, 'eee', { locale: currentLocale })}</span>
              <span className={`text-2xl font-serif font-black ${isSameDay(day, new Date()) ? 'text-pink-600' : 'text-gray-800 dark:text-white'}`}>
                {format(day, 'dd')}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex-grow overflow-y-auto custom-scrollbar relative">
          <div className="grid grid-cols-8 min-h-full">
            <div className="flex flex-col border-r border-pink-50/50 dark:border-white/5 bg-neutral-50/30 dark:bg-white/5">
              {times.map(time => (
                <div key={time} className="h-40 p-6 text-right border-b border-pink-50/30 dark:border-white/5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{time}</span>
                </div>
              ))}
            </div>
            
            {days.map(day => (
              <div key={day.toString()} className="flex flex-col border-r border-pink-50/50 dark:border-white/5 last:border-0 relative">
                {times.map((time, idx) => {
                    const formattedDate = format(day, 'yyyy-MM-dd');
                    const hour = time.split(':')[0];
                    const apptsInSlot = appointments.filter(a => 
                        a.appointment_date === formattedDate && 
                        a.appointment_time.startsWith(hour) &&
                        (searchTerm === '' || a.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    );

                    return (
                        <div 
                          key={time} 
                          className="h-40 border-b border-pink-50/20 dark:border-white/5 relative hover:bg-pink-50/10 dark:hover:bg-white/5 transition-colors cursor-pointer group/slot"
                          onClick={() => {
                              if (apptsInSlot.length === 0) {
                                setNewBooking(prev => ({ ...prev, appointment_date: formattedDate, appointment_time: time }));
                                setIsBookingModalOpen(true);
                              }
                          }}
                        >
                          <AnimatePresence>
                              {apptsInSlot.length === 0 && isSameDay(day, new Date()) && idx === 0 && (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity">
                                      <span className="text-[10px] font-black uppercase text-pink-300 italic">Disponível</span>
                                  </div>
                              )}
                              {apptsInSlot.map((appt) => (
                                <motion.div 
                                  key={appt.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`relative p-6 rounded-2xl border transition-all duration-300 shadow-sm group/card h-full flex flex-col justify-between ${
                                    appt.status === 'confirmada' 
                                      ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' 
                                      : appt.status === 'cancelada'
                                      ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20 opacity-60'
                                      : 'bg-white/80 border-white dark:bg-white/5 dark:border-white/10'
                                  }`}
                                >
                                    <div className="flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 italic">
                                                    {appt.appointment_time.substring(0,5)}
                                                </span>
                                                <div className={`p-1 rounded-lg ${appt.status === 'confirmada' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                                                    <Sparkles size={10} />
                                                </div>
                                            </div>
                                            <h4 className="font-serif font-black text-xs uppercase tracking-tight line-clamp-2 italic leading-none mb-1">
                                                {appt.customer_name}
                                            </h4>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1">
                                                <Scissors size={8} /> {appt.services?.name_pt || 'Serviço'}
                                            </p>
                                        </div>

                                        <div className="absolute inset-0 bg-white/95 dark:bg-[#1A1A1A]/95 opacity-0 group-hover/card:opacity-100 transition-all flex items-center justify-center gap-2 p-2 rounded-2xl backdrop-blur-sm z-30">
                                            {appt.status === 'pendente' ? (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appt.id, 'confirmada'); }}
                                                        className="p-2 bg-emerald-500 text-white rounded-xl hover:scale-110 transition-transform"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appt.id, 'cancelada'); }}
                                                        className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"
                                                    >
                                                        <AlertCircle size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); handleInvoiceAction(appt, 'preview'); }} className="p-2 bg-gray-900 text-white rounded-xl"><Eye size={16} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleInvoiceAction(appt, 'download'); }} className="p-2 bg-gray-100 dark:bg-white/10 text-gray-500 rounded-xl"><FileText size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                    )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Nova Marcação Profissional">
        <form onSubmit={handleCreateBooking} className="p-2 space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 italic">Seleccionar Cliente</label>
                <select 
                    value={newBooking.customer_id} 
                    onChange={e => setNewBooking({...newBooking, customer_id: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-bold italic appearance-none"
                    required
                >
                    <option value="">Escolha uma cliente...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 italic">Serviço Desejado</label>
                <select 
                    value={newBooking.service_id} 
                    onChange={e => handleServiceChange(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-bold italic appearance-none"
                    required
                >
                    <option value="">Escolha um serviço...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name_pt} - {s.price.toLocaleString()} MZN</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 italic">Data</label>
                    <input 
                        type="date" 
                        value={newBooking.appointment_date} 
                        onChange={e => setNewBooking({...newBooking, appointment_date: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl font-bold italic outline-none focus:ring-4 focus:ring-pink-500/10"
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 italic">Hora</label>
                    <input 
                        type="time" 
                        value={newBooking.appointment_time} 
                        onChange={e => setNewBooking({...newBooking, appointment_time: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl font-bold italic outline-none focus:ring-4 focus:ring-pink-500/10"
                        required 
                    />
                </div>
            </div>

            <div className="p-6 bg-gray-900 rounded-[2rem] text-white flex justify-between items-center shadow-xl shadow-pink-500/10">
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Total a Pagar</p>
                   <p className="text-2xl font-serif font-black tracking-tighter italic">{newBooking.total_price.toLocaleString()} MZN</p>
                </div>
                <Sparkles size={24} className="text-pink-500 opacity-50" />
            </div>

            <button type="submit" className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all border border-white/5">
                Confirmar Marcação no Estúdio
            </button>
        </form>
      </Modal>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && previewUrl && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white dark:bg-[#1E1E1E] w-full max-w-4xl h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-white/10"
             >
                <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Pré-visualização de Documento</h2>
                    <button onClick={() => setIsPreviewOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                        <Plus size={24} className="rotate-45" />
                    </button>
                </div>
                <iframe src={previewUrl} className="flex-grow w-full border-none" />
                <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">O documento será gerado seguindo os padrões fiscais do SERENA GLOW.</p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
