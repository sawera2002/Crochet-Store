import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, X, KeyRound, User, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter username');
      return;
    }
    if (!password) {
      setError('Please enter password');
      return;
    }
    const success = loginAdmin(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid username or password');
    }
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
          <p className="text-[#2d5560] text-xs sm:text-sm mt-1 max-w-xs">
            Restricted access for managing inventory, orders, and Karachi deliveries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#012f3d] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#4a707a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6ac8c1]/40 bg-[#faf8f2] text-[#012f3d] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] transition"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#012f3d] mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#4a707a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#6ac8c1]/40 bg-[#faf8f2] text-[#012f3d] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a707a] hover:text-[#012f3d] p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-rose-600 text-xs mt-1.5 font-medium">{error}</p>}
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
