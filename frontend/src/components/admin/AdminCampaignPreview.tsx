import React, { useState } from 'react';
import { Mail, MessageSquare, Smartphone, Monitor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampaignPreviewProps {
  campaign: {
    title: string;
    type: string;
    content: string;
  };
  onClose: () => void;
}

export const AdminCampaignPreview: React.FC<CampaignPreviewProps> = ({ campaign, onClose }) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>(campaign.type === 'sms' ? 'mobile' : 'desktop');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#FAFAFA] dark:bg-[#121212] w-full max-w-4xl max-h-[90vh] h-auto overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${campaign.type === 'email' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'}`}>
              {campaign.type === 'email' ? <Mail size={24} /> : <MessageSquare size={24} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pré-visualização de Campanha</p>
              <h2 className="text-xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter">{campaign.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/5">
              <button 
                onClick={() => setDevice('mobile')}
                className={`p-3 rounded-xl transition-all ${device === 'mobile' ? 'bg-white dark:bg-white/10 text-pink-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Smartphone size={20} />
              </button>
              <button 
                onClick={() => setDevice('desktop')}
                className={`p-3 rounded-xl transition-all ${device === 'desktop' ? 'bg-white dark:bg-white/10 text-pink-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Monitor size={20} />
              </button>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow h-auto p-12 bg-gray-50/50 dark:bg-black/20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {device === 'mobile' ? (
              <motion.div 
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-[320px] aspect-[9/16] bg-black rounded-[3rem] p-3 shadow-2xl relative border-[6px] border-gray-800"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10" />
                <div className="w-full h-full bg-white dark:bg-[#1a1a1a] rounded-[2.2rem] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">SG</div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-800 dark:text-white">Serena Glow</p>
                      <p className="text-[8px] text-emerald-500">Online</p>
                    </div>
                  </div>
                  <div className="flex-grow p-4 space-y-4">
                    <div className="bg-pink-500 text-white p-4 rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed max-w-[85%]">
                      {campaign.content}
                    </div>
                    <p className="text-[8px] text-gray-400 ml-2">Agora mesmo</p>
                  </div>
                  <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20">
                    <div className="h-8 w-full bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/5 flex items-center px-4">
                      <p className="text-[10px] text-gray-300 italic">Mensagem...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="desktop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/5"
              >
                <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-16">De:</span>
                      <span className="text-xs font-bold text-pink-500">Serena Glow Studio &lt;contato@serenaglow.com&gt;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-16">Para:</span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">cliente@exemplo.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-16">Assunto:</span>
                      <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">{campaign.title}</span>
                    </div>
                  </div>
                </div>
                <div className="p-12 h-auto">
                  <div className="max-w-[420px] w-full mx-auto flex flex-col items-center text-center space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="text-xl font-semibold tracking-normal whitespace-normal leading-snug border-b-2 border-pink-500 pb-1">SERENA GLOW</div>
                    </div>
                    <div className="text-gray-800 dark:text-white text-sm leading-relaxed space-y-4 font-sans break-normal whitespace-normal text-center w-full" style={{ wordBreak: 'normal', overflowWrap: 'normal' }}>
                      {campaign.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-gray-100 dark:border-white/5 text-center w-full">
                        <button className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium uppercase tracking-normal text-sm shadow-lg whitespace-nowrap">Agendar Agora</button>
                        <p className="text-xs text-gray-400 mt-8 max-w-[280px] mx-auto leading-relaxed">© 2026 Serena Glow Studio. Todos os direitos reservados. Lichinga, Moçambique.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-6 text-center bg-white dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
          <p className="text-[9px] font-black uppercase tracking-normal text-gray-400">Este é um mock de pré-visualização. O design real pode variar ligeiramente de acordo com o cliente de email.</p>
        </div>
      </motion.div>
    </div>
  );
};
