import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function Notification() {
  const { toast } = useProducts();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-sky-50 border-sky-200 text-sky-900'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${bgStyles[toast.type] || bgStyles.success}`}>
        {icons[toast.type] || icons.success}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
