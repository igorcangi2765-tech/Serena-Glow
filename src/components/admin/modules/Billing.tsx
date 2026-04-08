import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Plus, Send, RefreshCcw, TrendingUp, Calendar, CreditCard, Receipt, FileSignature, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useLanguage } from '@/LanguageContext';

interface Document {
  id: string;
  doc_number: string;
  type: string;
  metadata: any;
  created_at: string;
  sales?: {
    total: number;
    payment_method?: string;
    clients?: { name: string; phone?: string; email?: string };
    sale_items?: { service_name: string; price: number; quantity: number }[];
  };
}

export const Billing: React.FC = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [stats, setStats] = useState({
    totalMonthly: 0,
    docCount: 0,
    pendingDebt: 0,
    growth: 0
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await api.get('/billing/documents');
      const statsData = await api.get('/dashboard/stats'); // Reuse stats for summary

      setDocuments(docs || []);
      setStats({
        totalMonthly: statsData.revenue,
        docCount: docs?.length || 0,
        pendingDebt: 12500, // Still placeholder
        growth: 15.4
      });
    } catch (error: any) {
      console.error('Error fetching documents:', error.message);
      toast.error(t('admin.errorLoadingDocs'));
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (doc: Document) => {
    const pdf = new jsPDF();
    
    // Header Customization
    pdf.setFontSize(26);
    pdf.setTextColor(219, 39, 119); // Pink-600
    pdf.text('SERENA GLOW', 105, 25, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text('ESTETIC STUDIO & WELLNESS', 105, 32, { align: 'center' });
    pdf.text('Lichinga, Niassa - Moçambique | Tel: +258 XX XXX XXXX', 105, 37, { align: 'center' });
    
    // Aesthetic Line
    pdf.setDrawColor(244, 114, 182); 
    pdf.setLineWidth(0.5);
    pdf.line(20, 45, 190, 45);
    
    // Doc Type & Number
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text(`${doc.type.toUpperCase()}`, 20, 60);
    pdf.setFontSize(11);
    pdf.setTextColor(100);
    pdf.text(`NÚMERO DO DOCUMENTO: ${doc.doc_number}`, 20, 68);
    
    // Meta Info
    pdf.setFontSize(10);
    pdf.setTextColor(80);
    pdf.text(`DATA DE EMISSÃO: ${format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}`, 190, 60, { align: 'right' });
    pdf.setTextColor(31, 41, 55);
    pdf.text(`CLIENTE: ${doc.sales?.clients?.name || 'Venda de Balcão'}`, 20, 80);
    
    // Main Table
    autoTable(pdf, {
      startY: 90,
      head: [['DESCRIÇÃO DO SERVIÇO', 'QTD', 'P. UNITÁRIO', 'TOTAL BRUTO']],
      body: [
        ['Serviços Estéticos Integrados (POS)', '1', `${doc.sales?.total.toLocaleString()} MZN`, `${doc.sales?.total.toLocaleString()} MZN`]
      ],
      headStyles: { fillColor: [219, 39, 119], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
      foot: [['', '', 'TOTAL A PAGAR', `${doc.sales?.total.toLocaleString()} MZN`]],
      footStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'right' },
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 5 }
    });
    
    // Signature Area
    const finalY = (pdf as any).lastAutoTable.finalY + 40;
    pdf.setDrawColor(200);
    pdf.line(20, finalY, 80, finalY);
    pdf.line(130, finalY, 190, finalY);
    pdf.setFontSize(8);
    pdf.text('ASSINATURA DO CLIENTE', 50, finalY + 5, { align: 'center' });
    pdf.text('ASSINATURA SERENA GLOW', 160, finalY + 5, { align: 'center' });
    
    // Footer Legal
    pdf.setFontSize(8);
    pdf.setTextColor(180);
    pdf.text('Obrigada pela sua preferência. Este documento serve como comprovativo de faturação oficial.', 105, 285, { align: 'center' });

    pdf.save(`${doc.doc_number}.pdf`);
    toast.success('Documento descarregado com sucesso!', { 
        style: { borderRadius: '1rem', background: '#18181b', color: '#fff' }
    });
  };

  const PreviewModal = ({ doc, onClose }: { doc: Document; onClose: () => void }) => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-pink-100 dark:border-white/10"
      >
        <div className="p-8 border-b border-pink-50 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
          <div>
            <h3 className="text-xl font-serif font-black text-gray-900 dark:text-white uppercase tracking-tighter">Pré-visualização</h3>
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{doc.doc_number}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all">
            <RefreshCcw size={20} className="rotate-45" />
          </button>
        </div>

        <div className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-black text-pink-600 tracking-tighter">SERENA GLOW</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Estetic Studio & Wellness</p>
           </div>

           <div className="grid grid-cols-2 gap-10 mb-10 text-xs">
              <div className="space-y-2">
                 <p className="font-black text-gray-400 uppercase tracking-widest">Emitido para:</p>
                 <p className="text-lg font-serif font-black text-gray-900 dark:text-white">{doc.sales?.clients?.name || 'Venda de Balcão'}</p>
                 <p className="text-gray-500">{doc.sales?.clients?.phone || 'Telefone não registado'}</p>
              </div>
              <div className="space-y-2 text-right">
                 <p className="font-black text-gray-400 uppercase tracking-widest">Detalhes:</p>
                 <p className="font-bold text-gray-800 dark:text-white">{doc.type === 'invoice' ? 'Fatura' : 'Recibo'} Profissional</p>
                 <p className="text-gray-500">{format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}</p>
              </div>
           </div>

           <table className="w-full text-left mb-10">
              <thead>
                 <tr className="border-b-2 border-pink-100 dark:border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="py-4">Descrição</th>
                    <th className="py-4 text-center">Qtd</th>
                    <th className="py-4 text-right">Total</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-pink-50/10 dark:divide-white/5">
                 {doc.sales?.sale_items?.map((item, i) => (
                    <tr key={i} className="text-sm font-bold text-gray-700 dark:text-gray-300">
                       <td className="py-4">{item.service_name}</td>
                       <td className="py-4 text-center">{item.quantity}</td>
                       <td className="py-4 text-right">{item.price.toLocaleString()} MZN</td>
                    </tr>
                 )) || (
                    <tr className="text-sm font-bold text-gray-700 dark:text-gray-300">
                       <td className="py-4">Serviços Estéticos Diversos</td>
                       <td className="py-4 text-center">1</td>
                       <td className="py-4 text-right">{doc.sales?.total.toLocaleString()} MZN</td>
                    </tr>
                 )}
              </tbody>
           </table>

           <div className="bg-gray-50 dark:bg-zinc-950 p-6 rounded-2xl border-2 border-pink-100 dark:border-white/5 flex justify-between items-center">
              <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest">Total Final</span>
              <span className="text-3xl font-serif font-black text-pink-600 tracking-tighter">{doc.sales?.total.toLocaleString()} MZN</span>
           </div>
        </div>

        <div className="p-8 bg-gray-50 dark:bg-zinc-950 border-t border-pink-100 dark:border-white/5 flex gap-4">
           <button 
             onClick={() => { generatePDF(doc); onClose(); }}
             className="flex-grow py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
           >
             <Download size={18} /> Descarregar PDF
           </button>
           <button 
             onClick={onClose}
             className="px-8 py-4 bg-white dark:bg-white/5 text-gray-500 border border-gray-200 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
           >
             Fechar
           </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pb-2">
        <div>
          <h1 className="text-5xl font-serif font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Facturação <span className="text-pink-500 font-sans tracking-tight opacity-30 font-light ml-3">Billing System</span></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium italic text-base">Gestão documental e financeira centralizada do seu estúdio.</p>
        </div>
        
        <div className="flex gap-4">
             <button 
                onClick={fetchDocuments}
                className="p-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-pink-100/30 dark:border-white/5 rounded-2xl text-gray-500 hover:text-pink-500 transition-all shadow-sm"
            >
                <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
             <button 
                onClick={() => toast.success('Faturação automática activa!', { icon: '🤖' })}
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95"
              >
                <Plus size={16} /> Novo Documento
              </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
              { title: 'Facturado (Mês)', value: `${stats.totalMonthly.toLocaleString()} MZN`, icon: Receipt, color: 'emerald', trend: `${stats.growth >= 0 ? '+' : ''}${stats.growth.toFixed(1)}%` },
              { title: 'Documentos Emitidos', value: stats.docCount, icon: FileSignature, color: 'pink', trend: 'Total' },
              { title: 'Dívida Pendente', value: `${stats.pendingDebt.toLocaleString()} MZN`, icon: CreditCard, color: 'rose', trend: 'Atraso' },
          ].map((stat, idx) => (
              <motion.div 
                key={idx}
                 initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl p-6 rounded-2xl border border-white/50 dark:border-white/5 shadow-xl flex items-center justify-between group overflow-hidden"
              >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{stat.title}</p>
                        {stat.trend && <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>{stat.trend}</span>}
                    </div>
                    <p className="text-3xl font-serif font-black text-gray-800 dark:text-white tracking-tighter">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                </div>
              </motion.div>
          ))}
      </div>

      <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/60 dark:bg-white/5 border-b-2 border-pink-100 dark:border-white/10 text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">
                <th className="px-6 py-8">{t('admin.document')}</th>
                <th className="px-6 py-8">{t('admin.type')}</th>
                <th className="px-6 py-8">{t('admin.client')}</th>
                <th className="px-6 py-8">{t('admin.date')}</th>
                <th className="px-6 py-8 text-right font-black text-gray-900 dark:text-white tracking-widest uppercase">{t('admin.total')}</th>
                <th className="px-6 py-8 text-center">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/20 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Consultando arquivos...</p>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center align-middle">
                      <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <FileText size={40} className="text-gray-300" />
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2 italic uppercase tracking-widest">Lista Vazia</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Não existem facturas ou recibos no sistema.</p>
                      </div>
                  </td>
                </tr>
              ) : documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-all group border-b border-pink-50/10 dark:border-white/5 last:border-0">
                  <td className="px-6 py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 shadow-sm border border-gray-200/20">
                            <Receipt size={22} />
                        </div>
                        <span className="font-serif font-black text-gray-900 dark:text-white text-lg tracking-tighter whitespace-normal">{doc.doc_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-normal ${
                      doc.type === 'invoice' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    }`}>
                      {doc.type === 'invoice' ? 'Fatura' : 'Recibo'}
                    </span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-[11px] font-black border border-pink-500/20">
                            {(doc.sales?.clients?.name || 'V').charAt(0)}
                        </div>
                        <span className="text-sm font-black text-gray-700 dark:text-gray-200 whitespace-normal">{doc.sales?.clients?.name || 'Venda de Balcão'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-10">
                    <div className="flex items-center gap-3 text-gray-500 text-xs font-black uppercase tracking-widest whitespace-normal">
                        <Calendar size={14} className="text-pink-500/50" />
                        {format(new Date(doc.created_at), 'dd/MM/yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-10">
                    <div className="flex items-center justify-end gap-3 whitespace-normal">
                        <span className="text-xl font-serif font-black text-gray-900 dark:text-white tracking-tighter">{doc.sales?.total?.toLocaleString()}</span>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">MZN</span>
                    </div>
                  </td>
                  <td className="px-6 py-10 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => setPreviewDoc(doc)}
                        className="p-4 bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-900 hover:text-white rounded-2xl transition-all shadow-sm"
                        title="Visualizar Recibo"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => generatePDF(doc)}
                        className="p-4 bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-pink-600 hover:text-white rounded-2xl transition-all shadow-sm"
                        title="Descarregar PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        className="p-4 bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-emerald-500 hover:text-white rounded-[1.25rem] transition-all shadow-sm"
                        title="Enviar por Email"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-left space-y-4">
                  <h3 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">Relatórios Financeiros Avançados</h3>
                  <p className="text-base md:text-lg opacity-90 leading-relaxed italic font-medium max-w-2xl">
                      "Utilize os dados de facturação para entender os picos de procura no seu Studio. O último mês registou um aumento de 15% na faturação digital via POS."
                  </p>
              </div>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap shrink-0">
                  Relatório de Gestão <ArrowUpRight size={18} />
              </button>
          </div>
      </div>

      <AnimatePresence>
        {previewDoc && (
          <PreviewModal 
            doc={previewDoc} 
            onClose={() => setPreviewDoc(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
