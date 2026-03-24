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
    className={`relative w-full max-w-[450px] p-10 lg:p-14 rounded-[3rem] border transition-all duration-700 shadow-3xl overflow-hidden ${
      isDark 
        ? 'bg-[#0A0A0A]/60 backdrop-blur-3xl border-white/5 shadow-black/80' 
        : 'bg-white/80 backdrop-blur-3xl border-pink-50/50 shadow-pink-100/30'
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
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-1000 ${
      isDark ? 'bg-[#050505]' : 'bg-[#FAFAFA]'
    }`}>
      <Toaster position="top-right" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full blur-[160px] ${isDark ? 'bg-pink-900' : 'bg-pink-100'}`} 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className={`absolute bottom-1/4 -left-40 w-[600px] h-[600px] rounded-full blur-[160px] ${isDark ? 'bg-rose-900' : 'bg-rose-100'}`} 
        />
      </div>

      <GlassContainer isDark={isDark}>
        {/* Logo Section */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: -5 }}
          className="w-20 h-20 bg-gradient-to-br from-[#E91E63] to-[#C2185B] rounded-[2rem] mx-auto mb-12 flex items-center justify-center shadow-2xl shadow-pink-500/30 cursor-pointer text-white"
        >
          <Sparkles size={36} className="text-white/90" />
        </motion.div>
        
        <div className="text-center mb-14">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl font-serif font-black tracking-tighter mb-3 uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}
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
                  className={`w-full pl-13 pr-6 py-5 rounded-3xl border-2 transition-all font-medium text-sm outline-none ${
                    isDark 
                      ? 'bg-black/60 border-white/5 text-white focus:border-pink-500/50 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                      : 'bg-zinc-50 border-zinc-100 text-zinc-900 focus:border-pink-500/30 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-300'
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
                  className={`w-full pl-13 pr-6 py-5 rounded-3xl border-2 transition-all font-medium text-sm outline-none ${
                    isDark 
                      ? 'bg-black/60 border-white/5 text-white focus:border-pink-500/50 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-700' 
                      : 'bg-zinc-50 border-zinc-100 text-zinc-900 focus:border-pink-500/30 focus:ring-8 focus:ring-pink-500/5 placeholder:text-zinc-300'
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
              className={`group w-full h-18 rounded-3xl font-black tracking-[0.4em] uppercase text-[12px] transition-all flex items-center justify-center gap-4 active:scale-[0.97] transform-gpu shadow-2xl ${
                isDark 
                  ? 'bg-white text-black hover:bg-[#F0F0F0] hover:shadow-white/20' 
                  : 'bg-zinc-900 text-white hover:bg-black hover:shadow-black/20'
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
