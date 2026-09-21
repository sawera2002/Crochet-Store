import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, X, KeyRound, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(passcode);
    if (success) {
      setPasscode('');
      onClose();
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  const handleQuickFill = (code: string) => {
    setPasscode(code);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012f3d]/60 backdrop-blur-xs p-4">
      <div
        id="admin-login-modal"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#6ac8c1]/40 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#4a707a] hover:text-[#012f3d] p-1.5 rounded-full hover:bg-[#faf8f2] transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#faf8f2] text-[#012f3d] flex items-center justify-center mb-3 shadow-xs border border-[#6ac8c1]/40">
            <Lock className="w-7 h-7 text-[#012f3d]" />
          </div>
          <h2 className="text-2xl font-serif text-[#012f3d] font-bold">Zarsal Admin Login</h2>
          <p className="text-[#2d5560] text-sm mt-1 max-w-xs">
            Restricted access for managing customer orders, Karachi addresses, and crochet inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#012f3d] mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#4a707a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6ac8c1]/40 bg-[#faf8f2] text-[#012f3d] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] transition"
                autoFocus
              />
            </div>
            {error && <p className="text-rose-500 text-xs mt-1.5 font-medium">{error}</p>}
          </div>

          <div className="bg-[#faf8f2] rounded-xl p-3 border border-[#6ac8c1]/30 text-xs text-[#2d5560]">
            <div className="flex items-center gap-1.5 font-medium text-[#012f3d] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Quick Login Passcode:</span>
            </div>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('crochet2026')}
                className="px-2.5 py-1 bg-white hover:bg-[#faf8f2] border border-[#6ac8c1]/40 rounded-md text-[#012f3d] font-mono text-xs cursor-pointer transition shadow-2xs font-semibold"
              >
                crochet2026
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-2.5 py-1 bg-white hover:bg-[#faf8f2] border border-[#6ac8c1]/40 rounded-md text-[#012f3d] font-mono text-xs cursor-pointer transition shadow-2xs font-semibold"
              >
                admin
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#6ac8c1]/40 text-[#2d5560] text-sm font-semibold hover:bg-[#faf8f2] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] text-sm font-semibold transition cursor-pointer shadow-md active:scale-95"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
