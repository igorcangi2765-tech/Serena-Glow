import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle2, Minus, Search, UserPlus, CreditCard, Banknote, Smartphone, Percent, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/LanguageContext';
import { Modal } from '../Modal';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface CartItem extends Service {
  quantity: number;
}

export const SalesPOS: React.FC = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setServices(data || []);
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
    toast.success(`${service.name} ${t('admin.added')}`);
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
  
  const calculateTotal = () => {
    const sub = calculateSubtotal();
    if (discountType === 'percentage') {
      return sub * (1 - discount / 100);
    }
    return Math.max(0, sub - discount);
  };

  const total = calculateTotal();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    
    try {
      // 1. Create a sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          total: total,
          subtotal: calculateSubtotal(),
          discount_amount: discount,
          discount_type: discountType,
          payment_method: paymentMethod,
          client_id: selectedClient?.id || null,
          status: 'completed',
          type: 'pos'
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Create sale items
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        service_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // 3. Create a Document (Receipt) automatically
      const docNumber = `REC-${Date.now().toString().slice(-6)}`;
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          sale_id: sale.id,
          doc_number: docNumber,
          type: 'receipt',
          metadata: { items: cart.map(i => i.name) }
        });

      if (docError) throw docError;

      toast.success(t('admin.checkoutSuccess'));
      setCart([]);
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
      const { data, error } = await supabase
        .from('clients')
        .insert({ name, phone })
        .select()
        .single();
      
      if (error) throw error;
      setSelectedClient(data);
      toast.success(t('admin.clientAdded'));
    } catch (error: any) {
      toast.error(t('admin.errorAddingClient'));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif text-gray-800">{t('admin.counterSale')}</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-pink-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-pink-50">{t('admin.products')}</button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600">{t('admin.servicesTitle')}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map(service => (
            <button 
              key={service.id} 
              onClick={() => addToCart(service)}
              className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm hover:border-pink-500 hover:shadow-md transition-all text-left group"
            >
              <p className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition-colors">{service.name}</p>
              <p className="text-pink-600 font-bold mt-2 font-sans">{service.price.toLocaleString()} MZN</p>
              <div className="mt-4 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-pink-50 group-hover:bg-pink-500 group-hover:text-white flex items-center justify-center text-pink-500 transition-all">
                  <Plus size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-pink-100 shadow-xl flex flex-col overflow-hidden h-full">
        <div className="p-6 border-b border-pink-50 bg-white space-y-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-pink-500" />
            <h3 className="text-xl font-serif text-gray-800">{t('admin.cart')}</h3>
            {cart.length > 0 && (
              <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleQuickAddClient}
              className="px-3 py-2 bg-pink-50 text-pink-500 rounded-xl hover:bg-pink-100 transition-colors"
              title="Novo Cliente"
            >
              <UserPlus size={18} />
            </button>
            <div className="relative flex-1">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder={t('admin.clientOrPhone')}
                onChange={async (e) => {
                  if (e.target.value.length > 2) {
                    const { data } = await supabase.from('clients').select('*').or(`name.ilike.%${e.target.value}%,phone.ilike.%${e.target.value}%`).limit(1);
                    if (data?.[0]) setSelectedClient(data[0]);
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-pink-50/50 border border-pink-100 rounded-xl text-xs outline-none"
              />
            </div>
          </div>
          {selectedClient && (
            <div className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-bold uppercase">{selectedClient.name}</span>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-emerald-400 hover:text-emerald-600 text-[10px] font-bold uppercase">{t('admin.remove')}</button>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="font-sans italic">{t('admin.emptyCart')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="p-4 bg-neutral-50 rounded-2xl border border-transparent hover:border-pink-100 transition-all space-y-3">
                  <div className="flex justify-between">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white rounded-lg border border-pink-50 p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-pink-500 hover:bg-pink-50 rounded-md"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-pink-500 hover:bg-pink-50 rounded-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-pink-600 font-sans">{(item.price * item.quantity).toLocaleString()} MZN</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPaymentMethod('Dinheiro')}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${paymentMethod === 'Dinheiro' ? 'bg-pink-500 text-white border-pink-500 shadow-sm' : 'bg-white text-gray-400 border-pink-50 hover:bg-pink-50/50'}`}
              >
                <Banknote size={16} /> {t('admin.cash')}
              </button>
              <button 
                onClick={() => setPaymentMethod('M-Pesa')}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${paymentMethod === 'M-Pesa' ? 'bg-pink-500 text-white border-pink-500 shadow-sm' : 'bg-white text-gray-400 border-pink-50 hover:bg-pink-50/50'}`}
              >
                <Smartphone size={16} /> {t('admin.mpesa')}
              </button>
              <button 
                onClick={() => setPaymentMethod('Cartão')}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${paymentMethod === 'Cartão' ? 'bg-pink-500 text-white border-pink-500 shadow-sm' : 'bg-white text-gray-400 border-pink-50 hover:bg-pink-50/50'}`}
              >
                <CreditCard size={16} /> {t('admin.card')}
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="number"
                  placeholder={t('admin.discount')}
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-pink-100 rounded-xl text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                />
              </div>
              <button 
                onClick={() => setDiscountType(discountType === 'fixed' ? 'percentage' : 'fixed')}
                className="px-3 bg-white border border-pink-100 rounded-xl text-[10px] font-bold uppercase text-gray-400 hover:bg-pink-50"
              >
                {discountType === 'fixed' ? 'MZN' : '%'}
              </button>
            </div>

            <div className="pt-4 border-t border-pink-100 space-y-2">
              <div className="flex justify-between text-xs text-gray-400 font-sans">
                <span>{t('admin.subtotal')}</span>
                <span>{calculateSubtotal().toLocaleString()} MZN</span>
              </div>
              <div className="flex justify-between text-xs text-rose-400 font-sans italic">
                <span>{t('admin.discount')}</span>
                <span>-{discountType === 'percentage' ? `${discount}%` : `${discount.toLocaleString()} MZN`}</span>
              </div>
              <div className="flex justify-between text-gray-800 font-bold text-xl uppercase pt-2">
                <span className="font-serif">{t('admin.total')}</span>
                <span className="font-sans text-pink-600">{total.toLocaleString()} MZN</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className={`w-full py-5 rounded-2xl font-bold tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-sm ${
              cart.length === 0 || processing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-pink-200 active:scale-[0.98]'
            }`}
          >
            {processing ? t('admin.processing') : (
              <>
                <CheckCircle2 size={18} />
                {t('admin.finishSale')}
              </>
            )}
          </button>
      </div>
    </div>
  );
};
