import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Trash2, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Modal } from '../Modal';

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewImageOpen, setIsNewImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({
    image_url: '',
    category: 'Geral',
    client_name: ''
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Fallback to local API for professional default images
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const localData = await response.json();
          setImages(localData || []);
          return;
        }
      }
      
      setImages(data || []);
    } catch (error: any) {
      console.error('Gallery load error:', error);
      // Final fallback to local API if DB fails completely
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const localData = await response.json();
          setImages(localData || []);
        }
      } catch (e) {
         if (!error.message?.includes('401')) {
           toast.error('Erro ao carregar galeria');
         }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('gallery')
        .insert([newImage]);
        
      if (error) throw error;

      toast.success('Imagem adicionada com sucesso!');
      setIsNewImageOpen(false);
      setNewImage({ image_url: '', category: 'Geral', client_name: '' });
      fetchImages();
    } catch (error) {
      toast.error('Erro ao adicionar imagem');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja eliminar esta imagem?')) return;
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
        
      if (error) throw error;

      toast.success('Imagem eliminada');
      fetchImages();
    } catch (error) {
      toast.error('Erro ao eliminar imagem');
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-xl shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Galeria</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic text-sm">Gerencie as fotos dos seus trabalhos e do salão</p>
        </div>
        
        <button 
          onClick={() => setIsNewImageOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 relative z-20"
        >
            <Plus size={16} /> + Carregar Foto
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 font-serif italic text-gray-400">
          A carregar galeria...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-32 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-dashed border-gray-300 dark:border-white/10">
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={40} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2 italic">Nenhuma imagem na galeria</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Carregue a sua primeira foto para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {images.map((img) => (
                <motion.div 
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 border border-white/20 dark:border-white/5 shadow-lg"
                >
                    <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10 backdrop-blur-sm">
                        <button 
                          onClick={() => setSelectedImage(img.image_url)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all cursor-pointer"
                        >
                          <Maximize2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-4 bg-rose-500/80 hover:bg-rose-600 rounded-2xl text-white transition-all cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isNewImageOpen} onClose={() => setIsNewImageOpen(false)} title="Adicionar Imagem">
        <form onSubmit={handleAddImage} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">URL da Imagem</label>
            <input 
              type="url"
              value={newImage.image_url}
              onChange={(e) => setNewImage({...newImage, image_url: e.target.value})}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 text-sm focus:ring-4 focus:ring-pink-500/10 outline-none"
              placeholder="https://exemplo.com/foto.jpg"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Categoria</label>
              <select 
                value={newImage.category}
                onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 text-sm focus:ring-4 focus:ring-pink-500/10 outline-none"
              >
                <option value="Geral">Geral</option>
                <option value="Cabelo">Cabelo</option>
                <option value="Unhas">Unhas</option>
                <option value="Maquilhagem">Maquilhagem</option>
                <option value="Estúdio">Estúdio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome do Cliente (Opcional)</label>
              <input 
                type="text"
                value={newImage.client_name}
                onChange={(e) => setNewImage({...newImage, client_name: e.target.value})}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 text-sm focus:ring-4 focus:ring-pink-500/10 outline-none"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all">
            Guardar na Galeria
          </button>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Visualização">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src={selectedImage || ''} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain bg-black/5" />
        </div>
        <div className="mt-8">
            <button 
                onClick={() => setSelectedImage(null)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-black transition-all"
            >
                Fechar
            </button>
        </div>
      </Modal>
    </div>
  );
};
