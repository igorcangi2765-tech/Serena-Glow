import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { X, ArrowLeft, ArrowRight, Shield, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
  onSwitch: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, type, onSwitch }) => {
  const { t } = useLanguage();

  const title = type === 'privacy' ? t('footer.privacy') : t('footer.terms');
  const content = type === 'privacy' ? t('footer.privacyContent') : t('footer.termsContent');
  const switchLabel = type === 'privacy' ? t('footer.switchToTerms') : t('footer.switchToPrivacy');

  // Simple markdown-to-html parser for the placeholder text
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-serif font-bold text-gray-800 dark:text-[#EAEAEA] mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-600 dark:text-[#A0A0A0] leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-pink-100/20 dark:border-[#2E2E2E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-[#2E2E2E] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                  {type === 'privacy' ? (
                    <Shield className="w-5 h-5 text-pink-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-pink-500" />
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-[#EAEAEA] tracking-wide">
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2E2E2E] transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Swiper Area */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <motion.div
                key={type}
                initial={{ opacity: 0, x: type === 'privacy' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="prose dark:prose-invert max-w-none"
              >
                {renderContent(String(content))}
              </motion.div>

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#2E2E2E] flex flex-col sm:flex-row gap-4 items-center justify-between">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('footer.back')}
                </button>
                
                <button
                  onClick={onSwitch}
                  className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-6 py-3 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all font-medium group"
                >
                  {switchLabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PolicyModal;
