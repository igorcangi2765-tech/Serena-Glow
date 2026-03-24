import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { useTheme } from '@/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';

const GlassContainer: React.FC<{ children: React.ReactNode; className?: string; isDark: boolean }> = ({ children, className = '', isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
    className={`relative w-full max-w-[480px] p-12 lg:p-16 rounded-[4rem] border transition-all duration-700 overflow-hidden ${
      isDark 
        ? 'bg-[#0A0A0A]/60 backdrop-blur-3xl border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.8)]' 
        : 'bg-white/80 backdrop-blur-3xl border-white shadow-[0_32px_64px_rgba(233,30,99,0.08)]'
    } ${className}`}
  >
    {/* Animated background subtle glow */}
    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5 animate-pulse pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Erro ao iniciar sessão: ' + error.message, {
        style: {
          borderRadius: '20px',
          background: isDark ? '#1E1E1E' : '#fff',
          color: isDark ? '#fff' : '#000',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
    } else {
      toast.success('Bem-vinda de volta!', {
        icon: '✨',
        style: {
          borderRadius: '20px',
          background: isDark ? '#1E1E1E' : '#fff',
          color: isDark ? '#fff' : '#000',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      });
      navigate('/admin/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-all duration-1000 ${
      isDark ? 'bg-[#050505]' : 'bg-gradient-to-b from-[#FFF1F5] to-[#FFFFFF]'
    }`}>
      <Toaster position="top-right" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className={`absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full blur-[160px] ${isDark ? 'bg-pink-900' : 'bg-pink-200'}`} 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 18, repeat: Infinity }}
          className={`absolute bottom-1/4 -left-40 w-[600px] h-[600px] rounded-full blur-[160px] ${isDark ? 'bg-rose-900' : 'bg-rose-200'}`} 
        />
      </div>

      <GlassContainer isDark={isDark}>
        {/* Logo Section */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: -3 }}
          className="w-20 h-20 bg-gradient-to-br from-[#F471B5] via-[#E91E63] to-[#C2185B] rounded-[2rem] mx-auto mb-12 flex items-center justify-center shadow-3xl shadow-pink-500/30 cursor-pointer text-white"
        >
          <Sparkles size={36} className="text-white/90 drop-shadow-md" />
        </motion.div>
        
        <div className="text-center mb-14">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl font-serif font-black tracking-tighter mb-3 uppercase ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}
          >
            Serena <span className="text-[#E91E63] relative">Glow
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute left-0 -bottom-1 h-1 bg-[#E91E63]/20 rounded-full"
              />
            </span>
          </motion.h1>
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] opacity-60">
            Intelligent Management Suite
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-4">
            <div className="relative group">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-3">
                Identificador
              </label>
              <div className="relative">
                <Mail size={16} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-gray-300' : 'text-pink-500/50'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-14 pr-7 py-6 rounded-[2rem] border-2 transition-all font-medium text-sm outline-none ${
                    isDark 
                      ? 'bg-black/60 border-white/5 text-white focus:border-pink-500/50 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                      : 'bg-[#F9FAFB] border-[#F3F4F6] text-[#1E1E1E] focus:border-[#E91E63] focus:ring-8 focus:ring-pink-500/5 placeholder:text-[#9CA3AF]'
                  }`}
                  placeholder="Administradora"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div className="relative group">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-3">
                Chave de Acesso
              </label>
              <div className="relative">
                <Lock size={16} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-gray-300' : 'text-pink-500/50'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-14 pr-7 py-6 rounded-[2rem] border-2 transition-all font-medium text-sm outline-none ${
                    isDark 
                      ? 'bg-black/60 border-white/5 text-white focus:border-pink-500/50 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                      : 'bg-[#F9FAFB] border-[#F3F4F6] text-[#1E1E1E] focus:border-[#E91E63] focus:ring-8 focus:ring-pink-500/5 placeholder:text-[#9CA3AF]'
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 relative">
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`group w-full h-20 rounded-[2rem] font-black tracking-[0.4em] uppercase text-[13px] transition-all flex items-center justify-center gap-4 active:scale-[0.97] transform-gpu shadow-3xl overflow-hidden relative ${
                isDark 
                  ? 'bg-white text-black hover:bg-[#F0F0F0]' 
                  : 'bg-gradient-to-r from-[#F06292] to-[#E91E63] text-white hover:shadow-pink-500/40'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className={`w-6 h-6 border-3 rounded-full animate-spin ${isDark ? 'border-black border-t-transparent' : 'border-white border-t-transparent'}`} />
              ) : (
                <>
                  <span>Autenticar</span>
                  <motion.div
                    animate={isHovered ? { x: 5 } : { x: 0 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
            <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors group"
            >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Voltar à Página Principal
            </button>
        </div>
      </GlassContainer>
    </div>
  );
};
