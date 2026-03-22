import React from 'react';
import { useLanguage } from '@/LanguageContext';

export const Inbox: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-8 text-center text-gray-500">
      {t('admin.inboxPlaceholder') || 'Inbox Module coming soon...'}
    </div>
  );
};
