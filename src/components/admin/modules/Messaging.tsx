import React, { useState } from 'react';
import { MessageSquare, Send, Users, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

export const Messaging: React.FC = () => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('sms');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!content) return toast.error('Escreva uma mensagem');
    setSending(true);
    
    try {
      const { error } = await supabase
        .from('communications')
        .insert({
          type: type,
          recipient: 'Massa / All Customers',
          content: content,
          status: 'sent'
        });

      if (error) throw error;
      
      toast.success(`${type.toUpperCase()} enviado com sucesso para todos os clientes!`);
      setContent('');
    } catch (error: any) {
      console.error('Messaging error:', error.message);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-8 overflow-y-auto pr-4 custom-scrollbar">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">Centro de Mensagens</h2>
          <p className="text-gray-500 font-sans mt-1">Envie notificações e campanhas por SMS e Email.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-xl space-y-6">
          <div className="flex gap-4 p-1 bg-pink-50 rounded-2xl w-fit">
            <button 
              onClick={() => setType('sms')}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === 'sms' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-400 hover:bg-pink-100'}`}
            >
              SMS em Massa
            </button>
            <button 
              onClick={() => setType('email')}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === 'email' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-400 hover:bg-pink-100'}`}
            >
              Email Marketing
            </button>
          </div>

          <div className="space-y-4">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Escreva o conteúdo do seu ${type}...`}
              className="w-full h-48 p-6 rounded-3xl bg-neutral-50 border-2 border-transparent focus:border-pink-500 focus:bg-white focus:outline-none transition-all font-sans text-gray-700 resize-none"
            />
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium">
                Esta mensagem será enviada para <span className="text-pink-500 font-bold">845 clientes</span> ativos.
              </p>
              <button 
                onClick={handleSend}
                disabled={sending || !content}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
                    sending || !content ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-100 active:scale-95'
                }`}
              >
                {sending ? 'Enviando...' : (
                    <>
                        <Send size={16} /> 
                        Enviar Agora
                    </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-sm">
          <h3 className="text-xl font-serif text-gray-800 mb-6 flex items-center gap-2 border-b border-pink-50 pb-4">
            <CheckCircle2 size={20} className="text-emerald-500" />
            Campanhas Realizadas
          </h3>
          <div className="space-y-4">
            {[1].map(i => (
              <div key={i} className="flex items-center justify-between p-5 bg-pink-50/20 rounded-3xl border border-pink-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-pink-500">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Promoção de Março</p>
                    <p className="text-xs text-gray-500 font-sans">845 destinatários • SMS • Hoje</p>
                  </div>
                </div>
                <span className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tighter">Enviado</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-pink-100 shadow-xl p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 shadow-inner">
          <Users size={40} />
        </div>
        <div>
          <p className="text-4xl font-serif font-bold text-gray-800 tracking-tighter">845</p>
          <p className="text-sm text-gray-400 font-sans uppercase tracking-widest font-bold mt-1">Clientes na Base</p>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
          O SMS é o método mais eficaz para o mercado de Moçambique.
        </p>
        <div className="w-full pt-6 border-t border-pink-50">
           <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-black transition-colors uppercase tracking-widest text-xs shadow-xl shadow-neutral-100">
            Exportar Contactos
          </button>
        </div>
      </div>
    </div>
  );
};
