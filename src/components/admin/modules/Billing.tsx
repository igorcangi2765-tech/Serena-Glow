import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Plus, Send, RefreshCcw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Document {
  id: string;
  doc_number: string;
  type: string;
  metadata: any;
  created_at: string;
  sales?: {
    total: number;
    profiles?: { full_name: string };
  };
}

export const Billing: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*, sales(total, profiles(full_name))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error.message);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (doc: Document) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(22);
    pdf.setTextColor(219, 39, 119); // Pink-600
    pdf.text('SERENA GLOW BEAUTY STUDIO', 105, 20, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Lichinga, Niassa - Moçambique', 105, 28, { align: 'center' });
    pdf.text('Tel: +258 XX XXX XXXX | info@serenaglow.co.mz', 105, 33, { align: 'center' });
    
    // Horizontal Line
    pdf.setDrawColor(244, 114, 182); // Pink-400
    pdf.line(20, 40, 190, 40);
    
    // Doc Info
    pdf.setFontSize(16);
    pdf.setTextColor(31, 41, 55);
    pdf.text(`${doc.type.toUpperCase()}: ${doc.doc_number}`, 20, 55);
    
    pdf.setFontSize(10);
    pdf.text(`Data: ${format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}`, 20, 65);
    pdf.text(`Cliente: ${doc.sales?.profiles?.full_name || 'Venda de Balcão'}`, 20, 70);
    
    // Table (Mock items for now, in a real app these come from sale_items)
    autoTable(pdf, {
      startY: 85,
      head: [['Descrição', 'Qtd', 'Preço Unit.', 'Total']],
      body: [
        ['Serviços Estéticos Diversos', '1', `${doc.sales?.total.toLocaleString()} MZN`, `${doc.sales?.total.toLocaleString()} MZN`]
      ],
      headStyles: { fillColor: [219, 39, 119] },
      foot: [['', '', 'TOTAL', `${doc.sales?.total.toLocaleString()} MZN`]],
      footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
    
    // Footer
    const finalY = (pdf as any).lastAutoTable.finalY + 30;
    pdf.setFontSize(9);
    pdf.text('Obrigada pela sua preferência!', 105, finalY, { align: 'center' });
    pdf.text('Este documento serve de comprovativo de pagamento.', 105, finalY + 5, { align: 'center' });

    pdf.save(`${doc.doc_number}.pdf`);
    toast.success('Documento gerado com sucesso!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">Facturação e Documentos</h2>
          <p className="text-gray-500 font-sans mt-1">Gestão de faturas, recibos e cotações para os seus clientes.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchDocuments}
            className="p-3 bg-white border border-pink-200 rounded-2xl text-pink-500 hover:bg-pink-50 transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => toast('A faturação automática é iniciada após o checkout na Venda de Balcão.', { icon: '📄' })}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-100 transition-all uppercase tracking-widest text-xs active:scale-[0.98]"
          >
            <Plus size={18} /> Novo Documento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-pink-100 shadow-xl overflow-hidden">
        {loading ? (
            <div className="p-20 text-center text-pink-500 font-sans">Carregando documentos...</div>
        ) : documents.length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-sans italic flex flex-col items-center gap-4">
                <FileText size={48} className="opacity-20" />
                Sem documentos emitidos ainda.
            </div>
        ) : (
            <table className="w-full text-left">
              <thead className="bg-pink-50/50">
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <th className="p-6">Documento</th>
                  <th className="p-6">Tipo</th>
                  <th className="p-6">Cliente</th>
                  <th className="p-6">Data</th>
                  <th className="p-6">Total</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 font-sans">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-pink-50/20 transition-colors group">
                    <td className="p-6 font-bold text-gray-800">{doc.doc_number}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase ${
                        doc.type === 'invoice' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {doc.type === 'invoice' ? 'Fatura' : 'Recibo'}
                      </span>
                    </td>
                    <td className="p-6 text-gray-600">{doc.sales?.profiles?.full_name || 'Balcão'}</td>
                    <td className="p-6 text-gray-400 text-sm">{format(new Date(doc.created_at), 'dd/MM/yyyy')}</td>
                    <td className="p-6 font-bold text-gray-800">{doc.sales?.total?.toLocaleString()} MZN</td>
                    <td className="p-6 text-right space-x-2">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => generatePDF(doc)}
                                className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-sm" title="Ver/Imprimir"
                            >
                                <Download size={18}/>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-sm" title="Enviar Email"><Send size={18}/></button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
};
