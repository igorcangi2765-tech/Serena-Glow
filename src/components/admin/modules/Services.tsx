import React, { useState, useEffect } from 'react';
import { Plus, Search, Scissors, Clock, Edit2, Trash2, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Modal } from '../Modal';

export const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    category: 'Facial',
    duration: 60,
    price: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.get('/services');
      setServices(data || []);
    } catch (error: any) {
      console.error('Services Load Error:', error);
      toast.error(`Erro ao carregar serviços: ${error.message || 'Erro de conexão'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name_pt: service.name_pt || '',
        name_en: service.name_en || '',
        category: service.category || 'Facial',
        duration: service.duration || 60,
        price: service.price || 0
      });
    } else {
      setEditingService(null);
      setFormData({
        name_pt: '',
        name_en: '',
        category: 'Facial',
        duration: 60,
        price: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await api.post('/services', formData);
        toast.success('Serviço adicionado com sucesso!');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error('Erro ao salvar serviço. Verifique os dados.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja eliminar este serviço?')) return;
    
    try {
      await api.delete(`/services/${id}`);
      toast.success('Serviço eliminado com sucesso');
      fetchServices();
    } catch (error: any) {
      console.error('Delete Service Error:', error);
      toast.error(`Erro ao eliminar serviço: ${error.message}`);
    }
  };

  const filteredServices = services.filter(s => 
    s.name_pt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Serviços</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic text-sm">Gerencie os serviços disponíveis no salão</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Procurar serviço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-pink-100/30 dark:border-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all font-sans text-sm w-full md:w-64 shadow-inner"
                />
            </div>
            <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 relative z-20"
            >
                <Plus size={16} /> Novo Serviço
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-32 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-[2rem] border border-dashed border-gray-300 dark:border-white/10">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2">Nenhum serviço disponível</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Adicione serviços para aparecerem no site</p>
            <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 mx-auto"
            >
                <Plus size={16} /> Adicionar Serviço
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
                 <div key={service.id} className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-white/5 shadow-sm group hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-5">
                        <div className="p-3 bg-pink-500/5 text-pink-500 rounded-2xl group-hover:bg-pink-500/10 transition-colors">
                            <Tag size={20} />
                        </div>
                        <div className="flex gap-1 bg-white/50 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-xl border border-white/50 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenModal(service); }}
                                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-pink-500 transition-all"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(service.id); }}
                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-gray-400 hover:text-rose-500 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2">{service.category}</p>
                    <h3 className="text-xl font-serif font-black text-gray-800 dark:text-white mb-4 leading-tight group-hover:text-pink-600 transition-colors">{service.name_pt}</h3>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-pink-50 dark:border-white/5">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Clock size={14} className="text-pink-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{service.duration} min</span>
                        </div>
                        <div className="px-3 py-1.5 bg-pink-500/5 rounded-xl border border-pink-500/10 group-hover:bg-pink-500 group-hover:text-white transition-all">
                            <span className="text-sm font-serif font-black tracking-tighter">{service.price.toLocaleString()} MZN</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Modal Add/Edit Service */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-2">Nome (PT)</label>
                <input 
                    type="text" 
                    value={formData.name_pt} 
                    onChange={e => setFormData({...formData, name_pt: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-bold"
                    required 
                />
            </div>

            
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-2">Categoria</label>
                    <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-medium appearance-none"
                    >
                        <option value="Facial">Facial</option>
                        <option value="Maquilhagem">Maquilhagem</option>
                        <option value="Unhas">Unhas</option>
                        <option value="Cabelo">Cabelo</option>
                        <option value="Sobrancelhas">Sobrancelhas</option>
                        <option value="Geral">Geral</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-2">Preço (MZN)</label>
                    <input 
                        type="number" 
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-bold"
                        required 
                        min="0" step="100"
                    />
                </div>
            </div>



            <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all mt-4">
                {editingService ? 'Guardar Alterações' : 'Adicionar Serviço ao Catálogo'}
            </button>
        </form>
      </Modal>
    </div>
  );
};
