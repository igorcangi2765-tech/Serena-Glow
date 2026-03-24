import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Search, Filter, CheckCircle, Trash2, ChevronRight, User, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useLanguage } from '@/LanguageContext';
import { toast } from 'react-hot-toast';
import { Modal } from '../Modal';

interface InboxMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export const Inbox: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived' | 'replied'>('all');
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages (Keep real-time as it's a side-listener)
    const channel = supabase
      .channel('inbox_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox' }, (payload) => {
        const newMessage = payload.new as InboxMessage;
        setMessages(prev => [newMessage, ...prev]);
        toast.success(`Nova mensagem de ${newMessage.name}`, { icon: '📩' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.get('/inbox');
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching inbox:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/inbox/${id}`, { status: 'read' });
      
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: 'read' } : null);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const archiveMessage = async (id: string) => {
    try {
      await api.put(`/inbox/${id}`, { status: 'archived' });
      
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'archived' } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: 'archived' } : null);
      }
      toast.success('Mensagem arquivada');
    } catch (error) {
      console.error('Error archiving message:', error);
      toast.error('Erro ao arquivar');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Eliminar esta mensagem permanentemente?')) return;
    
    try {
      await api.delete(`/inbox/${id}`);
      
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Mensagem eliminada');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Erro ao eliminar');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;
    try {
      await api.put(`/inbox/${selectedMessage.id}`, { status: 'replied' });
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, status: 'replied' } : m));
      setSelectedMessage(prev => prev ? { ...prev, status: 'replied' } : null);
      toast.success('Resposta enviada com sucesso!', { icon: '📨' });
      setIsReplyOpen(false);
      setReplyText('');
    } catch (error) {
      toast.error('Erro ao enviar resposta');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || m.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectMessage = (msg: InboxMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      markAsRead(msg.id);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 dark:text-white uppercase tracking-tighter">Entrada <span className="text-pink-500 font-sans tracking-normal opacity-50 font-light ml-2">/ Inbox</span></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">Faça a gestão dos seus contactos e pedidos.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                <input 
                    type="text"
                    placeholder="Pesquisar mensagens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-6 py-3 bg-white dark:bg-[#1E1E1E] border border-pink-100/30 dark:border-[#2E2E2E] rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/50 transition-all font-sans text-sm w-64"
                />
            </div>
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-6 py-3 bg-white dark:bg-[#1E1E1E] border border-pink-100/30 dark:border-[#2E2E2E] rounded-2xl outline-none focus:border-pink-500/50 transition-all font-black uppercase text-[10px] tracking-widest text-gray-500"
            >
                <option value="all">Todas</option>
                <option value="unread">Não Lidas</option>
                <option value="read">Lidas</option>
                <option value="replied">Respondidas</option>
                <option value="archived">Arquivadas</option>
            </select>
        </div>
      </div>

      <div className="flex-grow flex gap-8 overflow-hidden min-h-0">
        {/* Sidebar List */}
        <div className="w-full md:w-[400px] shrink-0 flex flex-col bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-pink-50/50 dark:border-white/5 bg-white/40">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Conversas ({filteredMessages.length})</h2>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">A carregar...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4 px-10 text-center">
                <Mail size={48} className="text-gray-300" />
                <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Nenhuma mensagem encontrada nesta seleção.</p>
              </div>
            ) : filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-5 rounded-3xl cursor-pointer transition-all border-2 hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] ${
                  selectedMessage?.id === msg.id 
                    ? 'bg-pink-50 border-pink-200 shadow-lg shadow-pink-100/50 dark:bg-pink-900/20 dark:border-pink-500/30' 
                    : 'bg-white/60 border-transparent hover:border-pink-50 dark:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-500 flex items-center justify-center font-serif text-lg font-bold">
                            {msg.name.charAt(0)}
                        </div>
                        {msg.status === 'unread' && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 border-2 border-white rounded-full" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white truncate max-w-[160px] text-sm leading-tight mb-1">{msg.name}</h4>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black opacity-60">
                            {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${selectedMessage?.id === msg.id ? 'text-pink-500' : 'text-gray-300'}`} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed ml-13">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message View */}
        <div className="hidden md:flex flex-grow flex-col bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden shadow-xl">
             {selectedMessage ? (
               <div 
                 key={selectedMessage.id}
                 className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300"
               >
                 {/* Header */}
                 <div className="p-8 border-b border-pink-50/50 dark:border-white/5 bg-white/20 backdrop-blur-md">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-pink-500 text-white flex items-center justify-center font-serif text-3xl font-bold shadow-xl shadow-pink-200">
                                {selectedMessage.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-gray-800 dark:text-white tracking-tighter mb-2">{selectedMessage.name}</h3>
                                <div className="flex flex-wrap gap-3">
                                    <span className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100/50">
                                        <Mail size={12} /> <span className="opacity-50">EMAIL:</span> {selectedMessage.email}
                                    </span>
                                    {selectedMessage.phone && (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100/50">
                                            <Phone size={12} /> {selectedMessage.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => archiveMessage(selectedMessage.id)}
                                className="p-4 bg-amber-50 text-amber-500 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-inner"
                                title="Arquivar"
                            >
                                <Filter size={20} />
                            </button>
                            <button 
                                onClick={() => deleteMessage(selectedMessage.id)}
                                className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-inner"
                                title="Eliminar"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                 </div>

                 {/* Content */}
                 <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-8 opacity-40">
                            <Clock size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Recebida em {new Date(selectedMessage.created_at).toLocaleString()}</span>
                        </div>
                        
                        <div className="bg-white/40 dark:bg-white/5 rounded-[2rem] p-10 border border-white shadow-inner relative">
                            <MessageSquare className="absolute top-8 right-8 text-pink-500/10" size={64} />
                            <p className="text-lg text-gray-700 dark:text-gray-300 font-sans leading-relaxed relative z-10 whitespace-pre-wrap">
                                {selectedMessage.message}
                            </p>
                        </div>

                        <div className="mt-12 flex flex-col gap-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">Acções Rápidas</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setIsReplyOpen(true)}
                                    className="flex items-center justify-center gap-3 py-6 rounded-3xl bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-gray-200"
                                >
                                    <Mail size={18} /> Responder Mensagem
                                </button>
                                {selectedMessage.phone && (
                                    <a 
                                        href={`tel:${selectedMessage.phone}`}
                                        className="flex items-center justify-center gap-3 py-6 rounded-3xl bg-white border-2 border-pink-100 text-pink-500 font-black uppercase tracking-widest text-xs hover:bg-pink-50 transition-all"
                                    >
                                        <Phone size={18} /> Ligar Agora
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full opacity-30 p-20 text-center">
                 <div className="w-32 h-32 bg-pink-100 dark:bg-pink-900/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <Mail size={48} className="text-pink-500" />
                 </div>
                 <h3 className="text-2xl font-serif text-gray-500 dark:text-gray-400 mb-4 tracking-tighter italic font-medium">Seleccione uma mensagem</h3>
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] max-w-sm leading-relaxed text-gray-400 text-center mx-auto">
                    Clique numa conversa à esquerda para ver os detalhes e responder ao cliente.
                 </div>
               </div>
             )}
           
        </div>
      </div>

      <Modal isOpen={isReplyOpen} onClose={() => setIsReplyOpen(false)} title={`Responder a ${selectedMessage?.name}`}>
        <form onSubmit={handleReply} className="space-y-6">
          <div className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-2xl border border-pink-100 dark:border-white/10 mb-4">
            <p className="text-xs font-bold text-gray-500 mb-1">Para: {selectedMessage?.email}</p>
            <p className="text-xs font-bold text-gray-500">Assunto: Re: Contacto Serena Glow Beauty Studio</p>
          </div>
          <textarea 
            placeholder="Escreva a sua resposta de forma profissional e acolhedora..." 
            value={replyText} 
            onChange={e => setReplyText(e.target.value)} 
            className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-pink-500/20 transition-all min-h-[200px] resize-y" 
            required 
          />
          <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all">Enviar Resposta</button>
        </form>
      </Modal>

    </div>
  );
};
