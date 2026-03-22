import { toast } from 'react-hot-toast';

export const generateRevenueReport = (revenue: number) => {
  toast.success('Relatório de receitas gerado com sucesso!');
};

export const generateServicesReport = (servicesCount: number) => {
  toast.success('Análise de serviços gerada com sucesso!');
};

export const generateStudioReport = (data: any) => {
  toast.success('Relatório completo do estúdio gerado!');
};
