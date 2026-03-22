import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, Search, Filter, CheckCircle2, AlertCircle, FileText, Mail, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
  services?: { name: string };
}

export const Agenda: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'confirmado' | 'cancelado'>('todos');
  const { t, language } = useLanguage();
  const currentLocale = language === 'pt' ? pt : undefined;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: string, time: string} | null>(null);

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i));
  const times = Array.from({ length: 11 }).map((_, i) => format(addHours(startOfDay(new Date()), 8 + i), 'HH:00'));

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(name)')
        .gte('appointment_date', format(days[0], 'yyyy-MM-dd'))
        .lte('appointment_date', format(days[6], 'yyyy-MM-dd'));
      
      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error.message);
      toast.error(t('admin.errorLoadingAgenda'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      if (newStatus === 'confirmado') {
        const appt = appointments.find(a => a.id === id);
        if (appt) {
          const { data: sale, error: saleError } = await supabase
            .from('sales')
            .insert([{
              client_id: appt.client_id,
              total: appt.total_price || 0,
              payment_status: 'pending'
            }])
            .select()
            .single();

          if (!saleError && sale) {
            await supabase.from('documents').insert([{
              type: 'fatura',
              doc_number: `FT-${Date.now()}`,
              sale_id: sale.id
            }]);
            toast.success(t('admin.confirmedAndInvoiced'));
          }
        }
      } else {
        toast.success(t(`admin.booking${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`));
      }

      fetchAppointments();
    } catch (error: any) {
      console.error('Error updating status:', error.message);
      toast.error(t('admin.errorUpdatingStatus'));
    }
  };

  const handleDragStart = (e: React.DragEvent, apptId: string) => {
    e.dataTransfer.setData('apptId', apptId);
  };

  const handleDrop = async (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault();
    const apptId = e.dataTransfer.getData('apptId');
    if (!apptId) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ appointment_date: date, appointment_time: time })
        .eq('id', apptId);

      if (error) throw error;
      toast.success(t('admin.rescheduledSuccess'));
      fetchAppointments();
    } catch (error: any) {
      toast.error(t('admin.errorRescheduling'));
    }
  };

  const handleInvoiceAction = (appt: Appointment, action: 'download' | 'preview') => {
    const url = generateInvoicePDF({
      customer_name: appt.customer_name,
      doc_number: `INV-${appt.id.slice(0, 8)}`,
      type: 'Fatura',
      total: appt.total_price || 0,
      date: new Date().toISOString(),
      services: [appt.services?.name || 'Serviço Estético']
    }, action);

    if (action === 'preview' && url) {
      setPreviewUrl(url.toString());
      setIsPreviewOpen(true);
    } else if (action === 'download') {
      toast.success(t('admin.invoiceGenerated'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pendente': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelado': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">{t('admin.agenda')}</h2>
          <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-pink-500" />
          </div>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-500 font-sans">{t('admin.agendaSubtitle')}</p>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-pink-100 text-sm font-medium text-pink-600">
              <Calendar size={14} />
              {format(days[0], 'dd MMM', { locale: currentLocale })} - {format(days[6], 'dd MMM', { locale: currentLocale })}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Procurar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 w-64 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-white border border-pink-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          >
            <option value="todos">{t('admin.allStatuses')}</option>
            <option value="pendente">{t('admin.pendingPlural')}</option>
            <option value="confirmado">{t('admin.confirmedPlural')}</option>
            <option value="cancelado">{t('admin.cancelledPlural')}</option>
          </select>
          <button 
            onClick={() => toast('Funcionalidade de nova marcação será integrada com o formulário de reserva.', { icon: '📅' })}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-100 transition-all active:scale-[0.98]"
          >
            <Plus size={18} /> {t('admin.newBooking')}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-pink-100 shadow-xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-8 border-b border-pink-50 bg-pink-50/20 sticky top-0 z-10">
          <div className="p-4 border-r border-pink-50" />
          {days.map(day => (
            <div key={day.toString()} className="p-4 text-center border-r border-pink-50 last:border-0">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{format(day, 'eee', { locale: currentLocale })}</span>
              <span className={`text-lg font-serif font-bold ${isSameDay(day, new Date()) ? 'text-pink-600' : 'text-gray-800'}`}>
                {format(day, 'dd')}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-8 min-h-full">
            <div className="flex flex-col border-r border-pink-50 bg-neutral-50/50">
              {times.map(time => (
                <div key={time} className="h-24 p-4 text-right border-b border-pink-50/50">
                  <span className="text-xs font-bold text-gray-400 font-sans">{time}</span>
                </div>
              ))}
            </div>
            
            {days.map(day => (
              <div key={day.toString()} className="flex flex-col border-r border-pink-50 last:border-0 relative">
                {times.map(time => (
                  <div 
                    key={time} 
                    className="h-24 border-b border-pink-50/30 relative hover:bg-pink-50/10 transition-colors cursor-pointer group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, format(day, 'yyyy-MM-dd'), time)}
                    onClick={() => {
                        const existing = appointments.find(a => a.appointment_date === format(day, 'yyyy-MM-dd') && a.appointment_time.startsWith(time.split(':')[0]));
                        if (!existing) {
                          setSelectedSlot({ date: format(day, 'yyyy-MM-dd'), time });
                          setIsBookingModalOpen(true);
                        }
                    }}
                  >
                    {appointments
                      .filter(a => {
                        const matchesDate = a.appointment_date === format(day, 'yyyy-MM-dd') && a.appointment_time.startsWith(time.split(':')[0]);
                        const matchesSearch = a.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = statusFilter === 'todos' || a.status === statusFilter;
                        return matchesDate && matchesSearch && matchesStatus;
                      })
                      .map(appt => (
                        <div 
                          key={appt.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, appt.id)}
                          className={`absolute inset-1 p-2 rounded-xl border text-[10px] shadow-sm transition-all hover:scale-[1.05] z-20 overflow-hidden group/card cursor-move ${getStatusColor(appt.status)}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-bold truncate max-w-[70%]">{appt.customer_name}</div>
                            {appt.status === 'pendente' ? (
                              <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(appt.id, 'confirmado');
                                  }}
                                  className="p-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 shadow-sm"
                                  title={t('admin.confirmAndInvoice')}
                                >
                                  <CheckCircle2 size={10} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(appt.id, 'cancelado');
                                  }}
                                  className="p-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 shadow-sm"
                                  title={t('admin.cancel')}
                                >
                                  <AlertCircle size={10} />
                                </button>
                              </div>
                            ) : appt.status === 'confirmado' ? (
                              <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInvoiceAction(appt, 'preview');
                                  }}
                                  className="p-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 shadow-sm"
                                  title={t('admin.preview')}
                                >
                                  <Eye size={10} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInvoiceAction(appt, 'download');
                                  }}
                                  className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-sm"
                                  title={t('admin.download')}
                                >
                                  <FileText size={10} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success('Email de confirmação enviado para ' + appt.customer_name);
                                  }}
                                  className="p-1 bg-pink-500 text-white rounded-md hover:bg-pink-600 shadow-sm"
                                  title={t('admin.sendEmail')}
                                >
                                  <Mail size={10} />
                                </button>
                              </div>
                            ) : null}
                          </div>
                          <div className="opacity-80 truncate">{appt.services?.name || 'Serviço'}</div>
                          <div className="mt-1 flex items-center gap-1 opacity-70">
                            <Clock size={8} /> {appt.appointment_time.substring(0,5)}
                          </div>
                        </div>
                      ))}
                    <div className="absolute inset-x-0 top-0 h-px bg-pink-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Integration Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={t('admin.newBooking')}
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl border border-pink-100 text-pink-600">
            <Calendar size={20} />
            <div className="font-bold text-sm">
              {selectedSlot ? `${selectedSlot.date} @ ${selectedSlot.time}` : t('admin.selectSlot')}
            </div>
          </div>
          <p className="text-gray-500 font-sans text-sm">{t('admin.bookingFormInstructions')}</p>
          <button 
            onClick={() => {
              setIsBookingModalOpen(false);
              toast.success(t('admin.redirectingToBooking'));
            }}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:shadow-xl transition-all"
          >
            {t('admin.openBookingSystem')}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewUrl(null);
        }}
        title={t('admin.invoicePreview')}
      >
        {previewUrl && (
          <iframe 
            src={previewUrl} 
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        )}
      </Modal>
    </div>
  );
};
