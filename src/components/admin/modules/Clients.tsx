import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, DollarSign, User, Star, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/LanguageContext';
import { Modal } from '../Modal';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  allergies: string | null;
  is_vip: boolean;
  total_spent: number;
  last_visit: string | null;
  created_at: string;
}

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [clientHistory, setClientHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error.message);
      toast.error(t('admin.errorLoadingClients'));
    } finally {
      setLoading(false);
    }
  };
  const fetchHistory = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(name)')
        .eq('client_id', clientId)
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      setClientHistory(data || []);
    } catch (error: any) {
      toast.error(t('admin.errorLoadingHistory'));
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          notes: selectedClient.notes,
          allergies: selectedClient.allergies,
          is_vip: selectedClient.is_vip
        })
        .eq('id', selectedClient.id);

      if (error) throw error;
      toast.success(t('admin.clientUpdated'));
      setIsEditOpen(false);
      fetchClients();
    } catch (error: any) {
      toast.error(t('admin.errorUpdatingClient'));
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">{t('admin.clientsModule')}</h2>
          <p className="text-gray-500 font-sans mt-1">{t('admin.clientsSubtitle')} {clients.length} {t('admin.clientsCount')}.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder={t('admin.searchClient')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 w-64 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-pink-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 transition-colors">
            <Filter size={18} /> {t('admin.filter')}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-pink-100 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">{t('admin.client')}</th>
                <th className="px-8 py-4">{t('admin.contact')}</th>
                <th className="px-8 py-4">{t('admin.totalSpent')}</th>
                <th className="px-8 py-4">{t('admin.lastVisit')}</th>
                <th className="px-8 py-4">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-gray-400 italic">{t('admin.loadingClients')}</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-gray-400 italic">{t('admin.noClientsFound')}</td>
                </tr>
              ) : filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-pink-50/10 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800">{client.name}</p>
                          {client.is_vip && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200 uppercase tracking-tighter">VIP</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-sans">{t('admin.memberSince')} {new Date(client.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-pink-400" />
                      {client.phone}
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-pink-400" />
                        {client.email}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-4 text-emerald-600 font-bold font-sans">
                    {client.total_spent.toLocaleString()} MZN
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-500 font-sans">
                    {client.last_visit ? new Date(client.last_visit).toLocaleDateString() : t('admin.never')}
                    {client.allergies && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 w-fit">
                        <AlertCircle size={10} /> {t('admin.allergies')}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setSelectedClient(client);
                          fetchHistory(client.id);
                          setIsHistoryOpen(true);
                        }}
                        className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                        title={t('admin.viewHistory')}
                      >
                        <Calendar size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditOpen(true);
                        }}
                        className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                        title={t('admin.editClient')}
                      >
                        <User size={18} />
                      </button>
                      <button 
                        onClick={() => toast.success(`${t('admin.sendMessage')} ${client.name}`)}
                        className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                        title={t('admin.sendMessage')}
                      >
                        <Mail size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={t('admin.clientHistory')}>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-6 bg-pink-50/50 rounded-3xl border border-pink-100">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-pink-500 font-bold border border-pink-100">
              {selectedClient?.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-serif font-bold text-gray-800">{selectedClient?.name}</h4>
              <p className="text-sm text-gray-500 font-sans">{selectedClient?.phone}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{t('admin.pastAppointments')}</h5>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {clientHistory.length === 0 ? (
                <p className="text-center py-10 text-gray-400 italic text-sm">{t('admin.noHistory')}</p>
              ) : clientHistory.map(appt => (
                <div key={appt.id} className="p-4 bg-white border border-pink-50 rounded-2xl flex justify-between items-center hover:border-pink-200 transition-all">
                  <div>
                    <p className="font-bold text-gray-800">{appt.services?.name}</p>
                    <p className="text-xs text-gray-400 font-sans">{new Date(appt.appointment_date).toLocaleDateString()} @ {appt.appointment_time}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${appt.status === 'confirmado' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                    {t(`admin.${appt.status}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('admin.editClient')}>
        <form onSubmit={handleUpdateClient} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">{t('admin.notes')}</label>
              <textarea 
                value={selectedClient?.notes || ''}
                onChange={(e) => selectedClient && setSelectedClient({...selectedClient, notes: e.target.value})}
                className="w-full p-4 bg-pink-50/30 border border-pink-50 rounded-2xl text-sm focus:ring-1 focus:ring-pink-500 outline-none h-24 transition-all"
                placeholder={t('admin.notesPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 px-2">{t('admin.allergies')}</label>
              <input 
                type="text"
                value={selectedClient?.allergies || ''}
                onChange={(e) => selectedClient && setSelectedClient({...selectedClient, allergies: e.target.value})}
                className="w-full p-4 bg-rose-50/30 border border-rose-50 rounded-2xl text-sm focus:ring-1 focus:ring-rose-500 outline-none transition-all text-rose-600"
                placeholder={t('admin.allergiesPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <input 
                type="checkbox"
                checked={selectedClient?.is_vip || false}
                onChange={(e) => selectedClient && setSelectedClient({...selectedClient, is_vip: e.target.checked})}
                id="vip-check"
                className="w-5 h-5 accent-amber-500"
              />
              <label htmlFor="vip-check" className="text-sm font-bold text-amber-700 flex items-center gap-2 cursor-pointer uppercase tracking-tighter">
                <Star size={16} /> {t('admin.isVip')}
              </label>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:shadow-xl transition-all uppercase tracking-widest text-sm">
            {t('admin.saveChanges')}
          </button>
        </form>
      </Modal>
    </div>
  );
};
