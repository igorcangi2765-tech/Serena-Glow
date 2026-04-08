import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, DollarSign, User, Star, AlertCircle, TrendingUp, UserCheck, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/LanguageContext';
import { format } from 'date-fns';
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [clientHistory, setClientHistory] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    is_vip: false
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await api.get('/clients');
      setClients(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (clientId: string) => {
    try {
      const data = await api.get(`/clients/${clientId}/history`);
      setClientHistory(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar histórico');
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients', newClient);
      toast.success('Cliente adicionada com sucesso');
      setIsNewClientOpen(false);
      fetchClients();
    } catch (error: any) {
      toast.error('Erro ao adicionar cliente');
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      await api.put(`/clients/${selectedClient.id}`, {
        notes: selectedClient.notes,
        allergies: selectedClient.allergies,
        is_vip: selectedClient.is_vip
      });

      toast.success('Perfil atualizado com sucesso');
      setIsEditOpen(false);
      fetchClients();
    } catch (error: any) {
      toast.error('Erro ao atualizar cliente');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic text-sm">Gerencie e acompanhe todas as suas clientes</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Procurar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-pink-100/30 dark:border-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-sans text-sm w-full md:w-80 shadow-inner"
                />
            </div>
            <button 
                onClick={() => setIsNewClientOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 relative z-20"
            >
                <Plus size={16} /> + Nova Cliente
            </button>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl rounded-[3rem] border border-white/50 dark:border-white/5 shadow-2xl overflow-hidden shadow-pink-100/20">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/60 dark:bg-white/5 border-b border-pink-50/50 dark:border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                <th className="px-10 py-6 italic">Nome</th>
                <th className="px-10 py-6 italic">Contacto</th>
                <th className="px-10 py-6 italic">Total gasto</th>
                <th className="px-10 py-6 italic">Última visita</th>
                <th className="px-10 py-6 text-center italic">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/20 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-serif italic">A carregar registos...</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center align-middle">
                      <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <User size={40} className="text-gray-300" />
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2 italic uppercase tracking-widest">Ainda não há clientes registadas</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Adicione uma nova cliente para começar.</p>
                      </div>
                  </td>
                </tr>
              ) : filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-all group border-b border-pink-50/10 dark:border-white/5 last:border-0">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 text-pink-600 flex items-center justify-center font-black text-lg border border-pink-100 dark:border-white/10 shadow-sm transition-transform group-hover:scale-110">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-serif font-black text-gray-800 dark:text-white text-base leading-none italic whitespace-normal">{client.name}</p>
                          {client.is_vip && (
                            <span className="flex items-center px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black rounded-lg uppercase tracking-widest italic">VIP</span>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Cliente Premium</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1 italic">
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                           <Phone size={12} className="text-pink-500" /> {client.phone}
                        </div>
                        {client.email && (
                          <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                             <Mail size={12} className="text-pink-500" /> {client.email}
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                        <span className="text-lg font-serif font-black text-gray-800 dark:text-white tracking-tighter italic whitespace-normal">{client.total_spent.toLocaleString()} MZN</span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 italic">{client.last_visit ? new Date(client.last_visit).toLocaleDateString() : 'Nenhuma visita'}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => {
                          setSelectedClient(client);
                          fetchHistory(client.id);
                          setIsHistoryOpen(true);
                        }}
                        className="p-4 bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-pink-500 hover:text-white rounded-2xl transition-all"
                      >
                        <Calendar size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditOpen(true);
                        }}
                        className="p-4 bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-pink-500 hover:text-white rounded-2xl transition-all"
                      >
                        <User size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isNewClientOpen} onClose={() => setIsNewClientOpen(false)} title="Nova Cliente">
        <form onSubmit={handleCreateClient} className="space-y-4">
          <input type="text" placeholder="Nome" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-bold" required />
          <input type="tel" placeholder="Telemóvel" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-bold" required />
          <input type="email" placeholder="Email (Opcional)" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all" />
          <textarea placeholder="Notas / Preferências" value={newClient.notes} onChange={e => setNewClient({...newClient, notes: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all" rows={3} />
          <label className="flex items-center gap-3 text-sm font-bold bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-pink-100 dark:border-white/10 cursor-pointer">
            <input type="checkbox" checked={newClient.is_vip} onChange={e => setNewClient({...newClient, is_vip: e.target.checked})} className="w-5 h-5 accent-pink-500" />
            Marcar como Cliente VIP (Estrela)
          </label>
          <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all mt-4">Adicionar Cliente</button>
        </form>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Cliente">
        {selectedClient && (
          <form onSubmit={handleUpdateClient} className="space-y-4">
            <textarea placeholder="Notas / Preferências" value={selectedClient.notes || ''} onChange={e => setSelectedClient({...selectedClient, notes: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all" rows={3} />
            <textarea placeholder="Alergias (ex: Produtos específicos)" value={selectedClient.allergies || ''} onChange={e => setSelectedClient({...selectedClient, allergies: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all" rows={2} />
            <label className="flex items-center gap-3 text-sm font-bold bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-pink-100 dark:border-white/10 cursor-pointer">
              <input type="checkbox" checked={selectedClient.is_vip} onChange={e => setSelectedClient({...selectedClient, is_vip: e.target.checked})} className="w-5 h-5 accent-pink-500" />
              Estatuto VIP
            </label>
            <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all mt-4">Guardar Alterações</button>
          </form>
        )}
      </Modal>

      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={`Histórico: ${selectedClient?.name || ''}`}>
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {clientHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-10 italic">Nenhum histórico encontrado para esta cliente.</p>
          ) : (
            clientHistory.map((appt, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-pink-100/50 dark:border-white/10 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{new Date(appt.appointment_date).toLocaleDateString()} às {appt.appointment_time}</p>
                  <p className="text-sm text-gray-500 italic mt-1">{appt.services?.name_pt || 'Serviço'}</p>
                </div>
                <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-lg">{appt.status}</span>
              </div>
            ))
          )}
        </div>
      </Modal>

    </div>
  );
};
