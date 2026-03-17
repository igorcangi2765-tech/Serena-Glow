import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Filter, Plus, Clock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { format, startOfWeek, addDays, startOfDay, addHours, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';

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
      toast.error('Erro ao carregar agenda');
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-serif text-gray-800">Agenda de Marcações</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-500 font-sans">Gira o tempo do seu estúdio com precisão.</p>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-pink-100 text-sm font-medium text-pink-600">
              <CalendarIcon size={14} />
              {format(days[0], 'dd MMM', { locale: pt })} - {format(days[6], 'dd MMM', { locale: pt })}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-pink-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 transition-colors">
            <Filter size={18} /> Filtrar
          </button>
          <button 
            onClick={() => toast('Funcionalidade de nova marcação será integrada com o formulário de reserva.', { icon: '📅' })}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-100 transition-all active:scale-[0.98]"
          >
            <Plus size={18} /> Nova Marcação
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-pink-100 shadow-xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-8 border-b border-pink-50 bg-pink-50/20 sticky top-0 z-10">
          <div className="p-4 border-r border-pink-50" />
          {days.map(day => (
            <div key={day.toString()} className="p-4 text-center border-r border-pink-50 last:border-0">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{format(day, 'eee', { locale: pt })}</span>
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
                    onClick={() => {
                        const existing = appointments.find(a => a.appointment_date === format(day, 'yyyy-MM-dd') && a.appointment_time.startsWith(time.split(':')[0]));
                        if (!existing) toast(`Livre às ${time} de ${format(day, 'dd/MM')}`, { icon: '✨' });
                    }}
                  >
                    {appointments
                      .filter(a => a.appointment_date === format(day, 'yyyy-MM-dd') && a.appointment_time.startsWith(time.split(':')[0]))
                      .map(appt => (
                        <div 
                          key={appt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`Marcação: ${appt.customer_name}\n${appt.services?.name || 'Serviço'}`);
                          }}
                          className={`absolute inset-1 p-2 rounded-xl border text-[10px] shadow-sm transition-all hover:scale-[1.02] z-20 overflow-hidden ${getStatusColor(appt.status)}`}
                        >
                          <div className="font-bold truncate">{appt.customer_name}</div>
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
    </div>
  );
};
