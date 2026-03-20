import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Erro ao iniciar sessão: ' + error.message);
    } else {
      toast.success('Bem-vinda de volta!');
      navigate('/admin/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4 font-sans">
      <Toaster position="top-right" />
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-pink-100 border border-pink-50 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50" />
        
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-pink-200">
            <span className="text-white text-3xl font-serif">S</span>
          </div>
          
          <h1 className="text-4xl font-serif text-gray-800 mb-2 text-center">Serena Glow</h1>
          <p className="text-gray-500 text-center mb-10 font-medium tracking-wide">Painel de Gestão Integrada</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-pink-50 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 bg-pink-50/30 transition-all font-sans text-lg"
                placeholder="exemplo@email.com"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-pink-50 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/10 bg-pink-50/30 transition-all font-sans text-lg"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-5 rounded-2xl font-bold tracking-widest hover:shadow-xl hover:shadow-pink-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-sm"
            >
              {loading ? 'A Entrar...' : 'ENTRAR NO PAINEL'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
