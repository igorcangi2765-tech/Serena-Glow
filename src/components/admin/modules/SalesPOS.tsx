import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle2, Minus, Search, UserPlus, User, CreditCard, Banknote, Smartphone, Tag, ArrowRight, Zap, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/LanguageContext';
import { useTheme } from '@/ThemeContext';

interface Service {
  id: string;
  name_pt: string;
  name_en: string;
  price: number;
  duration: number;
}

interface CartItem extends Service {
  quantity: number;
  staff_id?: string;
}

interface Category {
  id: string;
  name_pt: string;
  name_en: string;
}

interface Staff {
  id: string;
  full_name: string;
  role: string;
}

export const SalesPOS: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (cart.length === 0 && showCart) {
      setShowCart(false);
    }
  }, [cart.length]);

  const fetchServices = async () => {
    try {
      const [servicesData, categoriesData, staffData] = await Promise.all([
        api.get('/services'),
        api.get('/services/categories'),
        api.get('/profiles')
      ]);
      
      setServices(servicesData || []);
      setCategories(categoriesData || []);
      setStaff(staffData || []);
    } catch (error: any) {
      console.error('Error fetching services:', error.message);
      toast.error(t('admin.errorLoadingServices'));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item => 
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
    setLastAddedId(service.id);
    setTimeout(() => setLastAddedId(null), 800);
    setShowCart(true);
    toast.success(`${language === 'pt' ? service.name_pt : service.name_en} ${t('admin.added')}`, {
        icon: '🛍️',
        style: { borderRadius: '1rem', background: '#18181b', color: '#fff', fontSize: '12px' }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    
    try {
      const saleData = {
        total: calculateSubtotal(),
        discount_amount: 0,
        discount_type: 'fixed',
        payment_method: paymentMethod,
        customer_id: selectedClient?.id || null,
        status: 'completed',
        type: 'pos',
        created_at: saleDate === new Date().toISOString().split('T')[0] ? new Date().toISOString() : `${saleDate}T12:00:00Z`
      };

      const saleItems = cart.map(item => ({
        service_id: item.id,
        name: language === 'pt' ? item.name_pt : item.name_en, // For metadata
        quantity: item.quantity,
        unit_price: item.price,
        staff_id: item.staff_id || null
      }));

      await api.post('/sales', { sale: saleData, items: saleItems });

      toast.success(t('admin.checkoutSuccess'), {
          duration: 4000,
          position: 'bottom-center',
          style: { borderRadius: '2rem', padding: '1rem 2rem', background: '#10b981', color: '#fff', fontWeight: 'bold' }
      });
      setCart([]);
      setSelectedClient(null);
    } catch (error: any) {
      console.error('Checkout error:', error.message);
      toast.error(t('admin.checkoutError'));
    } finally {
      setProcessing(false);
    }
  };

  const handleQuickAddClient = async () => {
    const name = prompt(t('admin.quickAddClientName'));
    if (!name) return;
    const phone = prompt(t('admin.quickAddClientPhone'));
    if (!phone) return;

    try {
      const data = await api.post('/clients', { name, phone });
      setSelectedClient(data);
      toast.success(t('admin.clientAdded'));
    } catch (error: any) {
      toast.error(t('admin.errorAddingClient'));
    }
  };

  const updateStaffItem = (id: string, staffId: string) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, staff_id: staffId } : item
    ));
    toast.success(t('admin.staffAssigned'), {
      icon: '👤',
      style: { borderRadius: '1rem', background: '#18181b', color: '#fff', fontSize: '10px' }
    });
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = (language === 'pt' ? s.name_pt : s.name_en).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || (s as any).category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700 flex flex-col items-center justify-center h-[calc(100vh-200px)] opacity-60">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-8 shadow-2xl shadow-pink-500/20" />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse">Sincronizando Terminal...</p>
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-180px)] animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fecdd3; }
      `}</style>
      {/* Services Area */}
      <div className={`h-full flex flex-col gap-6 transition-all duration-500 ${showCart ? 'lg:mr-[420px]' : 'w-full'}`}>
        {/* Page Header - Premium Refinement */}
        <div className="px-6 py-6 lg:px-8 bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/50 dark:border-white/5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-500">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl lg:text-3xl font-serif font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                        VENDAS <span className="text-[#E91E63] font-light">/</span> <span className="text-[#E91E63]/60 font-serif font-light lowercase italic tracking-normal">pos</span>
                    </h1>
                </div>
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-1">Terminal de faturação instantânea</p>
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E91E63] transition-all" size={18} />
                    <input 
                        type="text"
                        placeholder="Procurar serviço por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl text-xs font-bold focus:ring-8 focus:ring-[#E91E63]/5 focus:border-[#E91E63]/30 focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm placeholder:text-gray-300 placeholder:font-medium"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <input 
                        type="date"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                        className="px-5 py-4 bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase text-gray-500 outline-none focus:border-[#E91E63]/30 transition-all shadow-sm cursor-pointer"
                    />
                    <button 
                        onClick={() => setShowCart(!showCart)}
                        className={`w-14 h-14 rounded-2xl border transition-all relative flex items-center justify-center shadow-lg ${
                            showCart 
                                ? 'bg-[#E91E63] border-[#E91E63] text-white shadow-[#E91E63]/20' 
                                : 'bg-white/80 dark:bg-white/5 border-white/50 dark:border-white/10 text-gray-500 hover:text-[#E91E63] hover:border-[#E91E63]/20 hover:bg-white'
                        }`}
                    >
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#C2185B] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-md animate-in zoom-in">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Categories Bar - Pill Style */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar no-scrollbar flex-shrink-0 px-2 lg:px-4">
            <button
                onClick={() => setSelectedCategory(null)}
                className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                    !selectedCategory 
                        ? 'bg-[#1E1E1E] border-[#1E1E1E] text-white shadow-xl shadow-black/10' 
                        : 'bg-[#F3F4F6] dark:bg-white/5 border-transparent text-gray-400 hover:text-[#E91E63] hover:bg-white dark:hover:bg-white/10 shadow-sm'
                }`}
            >
                Todos
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                        selectedCategory === cat.id 
                            ? 'bg-[#E91E63] border-[#E91E63] text-white shadow-xl shadow-[#E91E63]/20' 
                            : 'bg-[#F3F4F6] dark:bg-white/5 border-transparent text-gray-400 hover:text-[#E91E63] hover:bg-white dark:hover:bg-white/10 shadow-sm'
                    }`}
                >
                    {language === 'pt' ? cat.name_pt : cat.name_en}
                </button>
            ))}
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 pb-20">
            {filteredServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 text-center opacity-30">
                    <Zap size={48} className="mx-auto mb-6 text-gray-400" />
                    <p className="font-serif italic text-2xl text-gray-400 mb-2 uppercase tracking-widest">Nenhum serviço disponível</p>
                    <p className="text-[10px] font-black uppercase tracking-widest">Verifique a ligação ao catálogo.</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:px-4">
                {filteredServices.map(service => (
                  <motion.div 
                    key={service.id} 
                    animate={{ 
                      scale: lastAddedId === service.id ? [1, 0.98, 1.02, 1] : 1,
                    }}
                    whileHover={{ y: -4, shadow: "0 20px 40px rgba(0,0,0,0.06)" }}
                    onClick={() => addToCart(service)}
                    className={`group relative bg-white dark:bg-[#1E1E1E] p-6 lg:p-7 rounded-[22px] border transition-all duration-500 flex flex-col justify-between min-h-[170px] cursor-pointer ${
                      lastAddedId === service.id 
                        ? 'border-[#E91E63] shadow-2xl shadow-[#E91E63]/10' 
                        : 'border-transparent dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-pink-50'
                    }`}
                  >
                    {/* Decorative abstract shape */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50/10 dark:bg-pink-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-1000" />
                    
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-serif font-black text-zinc-900 dark:text-white leading-tight tracking-tight max-w-[80%]">
                                {language === 'pt' ? service.name_pt : service.name_en}
                            </h3>
                            <div 
                                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 ${
                                    lastAddedId === service.id 
                                        ? 'bg-[#E91E63] text-white' 
                                        : 'bg-[#FCE4EC] dark:bg-pink-900/20 text-[#E91E63] hover:bg-[#E91E63] hover:text-white group-hover:shadow-lg group-hover:shadow-pink-200/50'
                                }`}
                            >
                                <Plus size={20} className={lastAddedId === service.id ? 'animate-pulse' : ''} />
                            </div>
                        </div>
                        
                        <div className="h-px bg-pink-50/50 dark:bg-white/5 w-1/3" />
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-end mt-6">
                        <div>
                            <p className="text-[10px] text-gray-300 dark:text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Preço</p>
                            <p className={`text-xl font-black tracking-tighter ${lastAddedId === service.id ? 'text-[#E91E63]' : 'text-[#E91E63] group-hover:text-[#C2185B]'}`}>
                                {service.price.toLocaleString()} <span className="text-[10px] font-sans">MZN</span>
                            </p>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Cart Area - Premium Refinement */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: showCart ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:absolute top-0 right-0 w-full lg:w-[420px] h-full z-[100] flex flex-col bg-white dark:bg-[#0A0A0A] border-l border-pink-100 dark:border-white/5 shadow-2xl overflow-hidden"
      >
        {/* 1. Header (Fixed) */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-pink-50/50 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl shrink-0">
            <div>
                <h2 className="text-2xl font-serif font-black text-gray-900 dark:text-white tracking-tight uppercase">Carrinho</h2>
                <p className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.2em] mt-1">
                    {cart.length} {cart.length === 1 ? 'Serviço' : 'Serviços'} selecionados
                </p>
            </div>
            <button 
                onClick={() => setCart([])}
                className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-white/5 text-[#E91E63] flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-all duration-300 shadow-sm"
            >
                <Trash2 size={18} />
            </button>
        </div>

        {/* 2. Cliente (Fixed) */}
        <div className="px-8 py-6 border-b border-pink-50/50 dark:border-white/5 shrink-0 bg-[#FAFAFA]/50 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between mb-4">
                 <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Cliente</label>
                 {selectedClient ? (
                     <button 
                         onClick={() => setSelectedClient(null)}
                         className="text-[10px] font-black text-[#E91E63] uppercase border-b border-transparent hover:border-[#E91E63] transition-all"
                     >
                         Trocar
                     </button>
                 ) : (
                    <button 
                        onClick={handleQuickAddClient}
                        className="text-[10px] font-black text-[#E91E63] uppercase border-b border-transparent hover:border-[#E91E63] transition-all"
                    >
                        + Novo
                    </button>
                 )}
            </div>
            
            {!selectedClient ? (
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E91E63] transition-all" size={16} />
                    <input 
                        type="text"
                        placeholder="Nome ou telefone..."
                        onChange={async (e) => {
                            const val = e.target.value;
                            if (val.length > 2) {
                                const data = await api.get(`/clients/search?q=${val}`);
                                if (data?.[0]) setSelectedClient(data[0]);
                            }
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-[#E91E63]/30 focus:ring-8 focus:ring-[#E91E63]/5 outline-none transition-all placeholder:text-gray-300"
                    />
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-white dark:bg-white/5 border border-pink-100/50 dark:border-white/5 rounded-2xl flex items-center gap-4 shadow-sm"
                >
                    <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-[#E91E63]">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedClient.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{selectedClient.phone || 'Sem telefone'}</p>
                    </div>
                </motion.div>
            )}
        </div>

        {/* 3. Serviços (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar space-y-4 bg-white dark:bg-[#0A0A0A]">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-20 h-20 bg-pink-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart size={32} className="text-[#E91E63]" />
                    </div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Carrinho vazio<br/>Selecione um serviço</p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                        <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="group p-5 bg-[#FAFAFA] dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-3xl hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="max-w-[70%]">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                                        {language === 'pt' ? item.name_pt : item.name_en}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <User size={10} className="text-gray-400" />
                                        <select 
                                            value={item.staff_id || ''}
                                            onChange={(e) => updateStaffItem(item.id, e.target.value)}
                                            className="bg-transparent text-[9px] font-black text-gray-400 uppercase tracking-widest outline-none cursor-pointer hover:text-[#E91E63] transition-colors"
                                        >
                                            <option value="">Atribuir Profissional</option>
                                            {staff.map(s => (
                                                <option key={s.id} value={s.id}>{s.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-[#E91E63] tracking-tighter">
                                    {(item.price * item.quantity).toLocaleString()} MZN
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                                <div className="flex items-center gap-4 bg-white dark:bg-black/40 px-3 py-2 rounded-2xl border border-zinc-100 dark:border-white/10 shadow-sm">
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#E91E63] hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#E91E63] hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>

        {/* 4. Resumo (Fixed) */}
        <div className="px-8 pt-6 pb-6 border-t border-pink-50/50 dark:border-white/5 bg-[#FAFAFA]/80 dark:bg-black/40 backdrop-blur-md shrink-0">
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-zinc-600 dark:text-zinc-300">{calculateSubtotal().toLocaleString()} MZN</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-[#E91E63] uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="flex items-center gap-2"><Tag size={12}/> Adicionar Desconto</span>
                    <span>0 MZN</span>
                </div>
                <div className="h-px bg-pink-100/50 dark:bg-white/5 my-4" />
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Total Final</span>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">IVA Incluído (17%)</p>
                    </div>
                    <motion.div 
                        key={cart.reduce((sum, item) => sum + item.quantity, 0)}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="flex items-baseline gap-1"
                    >
                        <span className="text-4xl font-serif font-black text-[#E91E63] tracking-tighter">
                            {calculateSubtotal().toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black text-[#E91E63] uppercase">MZN</span>
                    </motion.div>
                </div>
            </div>

            {/* 5. Pagamento (Fixed) */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                    { id: 'Dinheiro', label: 'Dinheiro', icon: <Banknote size={18} />, brandColor: 'bg-emerald-500' },
                    { id: 'M-Pesa', label: 'M-Pesa', icon: <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[8px] font-black">M</div>, brandColor: 'bg-green-600' },
                    { id: 'E-Mola', label: 'E-Mola', icon: <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] font-black">E</div>, brandColor: 'bg-orange-500' },
                    { id: 'Cartão', label: 'Cartão', icon: <CreditCard size={18} />, brandColor: 'bg-blue-600' }
                ].map((method) => (
                    <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
                            paymentMethod === method.id 
                                ? 'border-[#E91E63] bg-pink-50/50 dark:bg-[#E91E63]/10 text-[#E91E63] shadow-lg shadow-pink-100/30' 
                                : 'border-zinc-100 dark:border-white/5 bg-white dark:bg-white/5 text-gray-400 hover:border-pink-100 dark:hover:border-pink-900/30'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            paymentMethod === method.id ? `${method.brandColor} text-white` : 'bg-[#FAFAFA] dark:bg-white/5 text-gray-400'
                        }`}>
                            {method.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                    </button>
                ))}
            </div>

            {/* 6. Ação Final (Sticky Bottom) */}
            <button 
                disabled={cart.length === 0 || processing}
                onClick={handleCheckout}
                className={`group w-full h-[64px] rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] ${
                    cart.length === 0 || processing
                        ? 'bg-zinc-100 dark:bg-white/5 text-gray-400 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white hover:shadow-pink-500/40 hover:-translate-y-1'
                }`}
            >
                {processing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <span>Confirmar Venda — {calculateSubtotal().toLocaleString()} MZN</span>
                        <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                    </>
                )}
            </button>
        </div>
      </motion.div>
    </div>
  );
};
