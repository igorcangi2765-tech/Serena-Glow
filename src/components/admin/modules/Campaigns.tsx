import React from 'react';
import { useLanguage } from '@/LanguageContext';

export const Campaigns: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-8 text-center text-gray-500">
      {t('admin.campaignsPlaceholder') || 'Marketing Module coming soon...'}
    </div>
  );
};
