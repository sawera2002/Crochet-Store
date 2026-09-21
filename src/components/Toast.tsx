import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border pointer-events-auto ${
          toast.type === 'error'
            ? 'bg-rose-900 text-white border-rose-800'
            : toast.type === 'info'
            ? 'bg-stone-900 text-white border-stone-800'
            : 'bg-emerald-900 text-white border-emerald-800'
        }`}
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-300" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-stone-300" />
        ) : (
          <CheckCircle className="w-4 h-4 text-emerald-300" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
