import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { NavigationTab } from '../types';
import { getWhatsAppUrl } from '../data/contentData';
import {
  ShoppingBag,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Lock,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Heart
} from 'lucide-react';
import { AdminLoginModal } from './AdminLoginModal';

interface NavbarProps {
  onOpenCart: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onNavigate }) => {
  const { cartCount, isAdmin, logoutAdmin, activeTab, setActiveTab, orders, settings } = useStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending_payment' || o.status === 'confirmed'
  ).length;

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'shop', label: 'Shop' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    const url = getWhatsAppUrl(
      settings.whatsappNumber,
      `Hello ${settings.storeName}! I want to place an order for delivery in Karachi.`
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Top Notification Announcement Bar (Soft Brand Colors, NO black) */}
      <div className="bg-[#012f3d] text-[#faf8f2] text-xs py-2 px-4 border-b border-[#6ac8c1]/25">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1] shrink-0" />
            <span className="tracking-wide">
              <strong>Zarsal</strong>: 100% Handcrafted Crochet • Free Karachi Delivery over Rs. 2,500
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#faf8f2]/90 text-[11px]">
            <span className="hidden md:inline font-medium">Cash on Delivery &amp; EasyPaisa</span>
            <span className="flex items-center gap-1 text-[#6ac8c1]">
              <MapPin className="w-3 h-3" />
              <span>Delivering in Karachi Only</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f2]/95 backdrop-blur-md border-b border-[#6ac8c1]/20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#012f3d] lg:hidden rounded-xl hover:bg-[#6ac8c1]/15 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo: Zarsal */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-[#6ac8c1]/40 flex items-center justify-center shadow-xs group-hover:border-[#012f3d] transition">
                <span className="text-2xl">🧶</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#012f3d] leading-none">
                    Zarsal
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#6ac8c1]/20 text-[#012f3d] text-[10px] font-bold rounded-md uppercase font-sans">
                    Crochet
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#2d5560] font-sans tracking-wider uppercase block mt-0.5 font-medium">
                  Handmade Crochet Studio • Karachi
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Home, About, Shop, Blogs, Contact) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative ${
                      isActive
                        ? 'text-[#012f3d] bg-white shadow-2xs border border-[#6ac8c1]/40'
                        : 'text-[#2d5560] hover:text-[#012f3d] hover:bg-white/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#6ac8c1] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Direct WhatsApp Action Button */}
              <button
                onClick={handleWhatsAppClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#012f3d] border border-[#25D366]/40 rounded-xl text-xs font-semibold transition cursor-pointer"
                title="Order directly on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span className="hidden md:inline">WhatsApp Order</span>
              </button>

              {/* Cart Button */}
              <button
                id="open-cart-button"
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#6ac8c1]" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-[#6ac8c1] text-[#012f3d] font-bold px-1.5 py-0.2 rounded-full text-xs font-mono">
                  {cartCount}
                </span>
              </button>

              {/* Admin Access: Only Admin Views Admin Panel */}
              {isAdmin ? (
                <div className="flex items-center gap-1.5 pl-1 border-l border-[#6ac8c1]/30">
                  <button
                    onClick={() => handleNavClick(activeTab === 'admin' ? 'home' : 'admin')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                      activeTab === 'admin'
                        ? 'bg-[#012f3d] text-[#faf8f2] border border-[#012f3d]'
                        : 'bg-white text-[#012f3d] hover:bg-[#faf8f2] border border-[#6ac8c1]/40'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#6ac8c1]" />
                    <span className="hidden sm:inline">
                      {activeTab === 'admin' ? 'Storefront' : 'Admin Panel'}
                    </span>
                    {pendingOrdersCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-mono font-bold">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={logoutAdmin}
                    title="Log Out of Admin Panel"
                    className="p-2 text-[#2d5560] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Discreet login access for owner, keeping regular customers purely in website view */
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="p-2 text-[#4a707a] hover:text-[#012f3d] hover:bg-white rounded-xl transition cursor-pointer"
                  title="Owner / Admin Login"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Panel */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#6ac8c1]/20 py-4 px-2 space-y-2 bg-[#faf8f2] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      activeTab === link.id
                        ? 'bg-[#012f3d] text-[#faf8f2]'
                        : 'bg-white text-[#012f3d] border border-[#6ac8c1]/30 hover:bg-[#f3eee2]'
                    }`}
                  >
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>

              {/* Mobile WhatsApp Action */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs mt-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat &amp; Order on WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Admin Login Modal */}
      <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};
