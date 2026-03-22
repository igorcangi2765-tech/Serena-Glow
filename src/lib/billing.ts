import { toast } from 'react-hot-toast';

export const generateInvoicePDF = (data: any, action: 'download' | 'preview') => {
  if (action === 'download') {
    toast.success('Fatura gerada com sucesso!');
    return null;
  }
  
  // Return a dummy data URL for preview
  return `data:text/plain;base64,${btoa('Preview: Invoice for ' + data.customer_name)}`;
};
