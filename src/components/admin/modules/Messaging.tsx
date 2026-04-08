import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, Mail, CheckCircle2, Sparkles, Smartphone, Globe, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/LanguageContext';

export const Messaging: React.FC = () => {
  const { t } = useLanguage();
  const [content, setContent] = useState('');
  const [type, setType] = useState('sms');
  const [sending, setSending] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [countRes, historyRes] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('communications').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (countRes.error) throw countRes.error;
      if (historyRes.error) throw historyRes.error;

      setClientCount(countRes.count || 0);
      setHistory(historyRes.data || []);
    } catch (error) {
      console.error('Error fetching messaging data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!content) return toast.error('Por favor, escreva o conteúdo da mensagem.');
    setSending(true);
    
    try {
      const { error } = await supabase
        .from('communications')
        .insert({
          type: type,
          recipient: `Base Total / ${clientCount} Clientes`,
          content: content,
          status: 'sent'
        });

      if (error) throw error;
      
      toast.success(`${type.toUpperCase()} enviado com sucesso para a base total!`, {
          icon: '🚀',
          style: { borderRadius: '1rem', background: '#18181b', color: '#fff' }
      });
      setContent('');
      fetchData();
    } catch (error: any) {
      console.error('Messaging error:', error.message);
      toast.error('Erro ao processar envio em massa.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 dark:text-white uppercase tracking-tighter">Marketing <span className="text-pink-500 font-sans tracking-normal opacity-50 font-light ml-2">/ Messaging</span></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Comunicação directa e automatizada com a sua audiência.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-pink-500/10 transition-colors" />
                
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-wrap gap-4 p-1.5 bg-gray-100 dark:bg-white/5 rounded-[2rem] w-fit shadow-inner">
                        <button 
                            onClick={() => setType('sms')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${type === 'sms' ? 'bg-white dark:bg-zinc-800 text-pink-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Smartphone size={14} /> SMS em Massa
                        </button>
                        <button 
                            onClick={() => setType('email')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${type === 'email' ? 'bg-white dark:bg-zinc-800 text-pink-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Globe size={14} /> Newsletter Email
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`Escreva a sua mensagem de ${type.toUpperCase()} aqui...`}
                                className="w-full h-64 p-8 rounded-[2.5rem] bg-white dark:bg-black/20 border border-pink-100/50 dark:border-white/10 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all font-sans text-gray-700 dark:text-gray-200 resize-none text-lg leading-relaxed shadow-inner"
                            />
                            <div className="absolute bottom-6 right-8">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${content.length > 160 ? 'text-rose-500' : 'text-gray-300'}`}>
                                    {content.length} caracteres
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                            <div className="flex items-center gap-4 px-6 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-600">
                                <ShieldCheck size={20} />
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Segmentação: <span className="opacity-60">Base Geral ({clientCount} contactos activos)</span>
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleSend}
                                disabled={sending || !content}
                                className={`flex items-center justify-center gap-4 px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.25em] text-[10px] shadow-2xl transition-all group active:scale-95 relative z-20 ${
                                    sending || !content ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'bg-gray-900 text-white hover:bg-black'
                                }`}
                            >
                                {sending ? 'Processando Envios...' : (
                                    <>
                                        Disparar Campanha <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 dark:border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-pink-50/50 dark:border-white/5">
                    <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <CheckCircle2 size={24} className="text-emerald-500" /> Histórico de Disparos
                    </h3>
                    <button className="text-[9px] font-black text-pink-500 uppercase tracking-widest hover:underline">Ver Relatório Completo</button>
                </div>
                
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <p className="text-center py-10 text-gray-400 italic">Nenhum disparo recente.</p>
                    ) : history.map((campaign, idx) => (
                        <div key={idx} className="flex items-center justify-between p-6 bg-white/60 dark:bg-white/5 rounded-3xl border border-white dark:border-white/5 group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-pink-500/5 text-pink-500 rounded-2xl group-hover:scale-110 transition-transform">
                                    <MessageSquare size={20} />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-serif font-black text-gray-800 dark:text-white uppercase tracking-tight line-clamp-1">{campaign.content}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                        {campaign.recipient} • {campaign.type.toUpperCase()} • {new Date(campaign.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm shadow-emerald-100">{campaign.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center text-pink-500 shadow-inner mb-8 border border-white/10">
                    <Users size={40} />
                </div>
                <p className="text-5xl font-serif font-black tracking-tighter mb-2">{clientCount}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 opacity-80 mb-6 font-bold">Contactos Activos</p>
                <p className="text-xs text-gray-400 leading-relaxed font-medium italic opacity-60 mb-8">
                    A sua base de dados cresceu 24% no último trimestre. Recomendamos campanhas de SMS para alta taxa de conversão.
                </p>
                <button className="w-full py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-105 transition-all">
                    Exportar Base CSV
                </button>
            </div>

            <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 dark:border-white/5 shadow-xl">
                <h4 className="text-sm font-serif font-black text-gray-800 dark:text-white uppercase tracking-widest mb-6">Sugestões Smart</h4>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                            <span className="text-gray-800 dark:text-white font-bold">Pro-tip:</span> Use emojis no início do SMS para aumentar o CTR em até 12%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
