import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

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
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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
      toast.error('Erro ao carregar serviços');
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
    toast.success(`${service.name} adicionado`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    
    try {
      // 1. Create a sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          total: total,
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

      toast.success('Venda concluída e recibo gerado!');
      setCart([]);
    } catch (error: any) {
      console.error('Checkout error:', error.message);
      toast.error('Erro ao processar venda');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-pink-500">Carregando serviços...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif text-gray-800">Venda de Balcão</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-pink-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-pink-50">Produtos</button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600">Serviços</button>
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
        <div className="p-6 border-b border-pink-50 flex items-center gap-3 bg-pink-50/30">
          <ShoppingCart className="text-pink-500" />
          <h3 className="text-xl font-serif text-gray-800">Carrinho</h3>
          {cart.length > 0 && (
            <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="font-sans italic">Carrinho vazio</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-transparent hover:border-pink-100 transition-all">
                <div>
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 font-sans">{item.quantity}x {item.price.toLocaleString()} MZN</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-pink-50/50 border-t border-pink-100 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600 font-sans">
              <span>Subtotal</span>
              <span>{total.toLocaleString()} MZN</span>
            </div>
            <div className="flex justify-between text-gray-800 font-bold text-xl uppercase pt-4 border-t border-pink-200">
              <span className="font-serif">Total</span>
              <span className="font-sans">{total.toLocaleString()} MZN</span>
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
            {processing ? 'Processando...' : (
              <>
                <CheckCircle2 size={18} />
                Finalizar Venda
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
