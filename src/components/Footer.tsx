import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory, NavigationTab } from '../types';
import { getWhatsAppUrl } from '../data/contentData';
import { Sparkles, Lock, PhoneCall, Mail, MapPin, MessageCircle, Heart } from 'lucide-react';
import { AdminLoginModal } from './AdminLoginModal';

interface FooterProps {
  onSelectCategory?: (cat: ProductCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const { settings, isAdmin, setActiveTab } = useStore();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleCategoryClick = (cat: ProductCategory) => {
    setActiveTab('shop');
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    const url = getWhatsAppUrl(
      settings.whatsappNumber,
      `Hello ${settings.storeName}! I want to inquire about your handmade crochet pieces in Karachi.`
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-white border-t border-[#6ac8c1]/30 text-[#2d5560] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Zarsal Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧶</span>
              <span className="font-serif text-2xl font-bold text-[#012f3d]">Zarsal</span>
            </div>
            <p className="text-[#2d5560] leading-relaxed text-xs">
              Every loop woven with patient hands. Zarsal is Karachi's dedicated handmade crochet
              studio crafting timeless bags, hats, bracelets, keychains, and heirloom handkerchiefs.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#012f3d] font-semibold pt-1">
              <span>Handmade with love in Karachi, Pakistan</span>
              <Heart className="w-3.5 h-3.5 text-[#6ac8c1] fill-[#6ac8c1]" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-sm text-[#012f3d] uppercase tracking-wider">
              Explore Zarsal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-[#012f3d] transition cursor-pointer text-[#2d5560]"
                >
                  Home (New Collection)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#012f3d] transition cursor-pointer text-[#2d5560]"
                >
                  About Our Crochet Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('shop')}
                  className="hover:text-[#012f3d] transition cursor-pointer text-[#2d5560]"
                >
                  Shop All Crochet Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('blogs')}
                  className="hover:text-[#012f3d] transition cursor-pointer text-[#2d5560]"
                >
                  Crochet Guides &amp; Blogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-[#012f3d] transition cursor-pointer text-[#2d5560]"
                >
                  Contact &amp; Karachi Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Karachi Delivery & Payments */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-sm text-[#012f3d] uppercase tracking-wider">
              Karachi Delivery &amp; Pay
            </h4>
            <div className="space-y-2 text-[#2d5560] text-xs">
              <p>
                <strong className="text-[#012f3d]">EasyPaisa:</strong> Instant payment transfer to{' '}
                <span className="font-mono font-semibold text-[#012f3d]">{settings.easyPaisaAccountNumber}</span>.
              </p>
              <p>
                <strong className="text-[#012f3d]">Cash on Delivery (COD):</strong> Pay cash to our rider anywhere in Karachi.
              </p>
              <div className="p-2.5 rounded-xl bg-[#faf8f2] border border-[#6ac8c1]/30 text-[11px] text-[#2d5560]">
                <strong className="text-[#012f3d]">Delivery Coverage:</strong> Exclusively Karachi (DHA, Clifton, Gulshan, Johar, PECHS, Nazimabad, etc.)
              </div>
            </div>
          </div>

          {/* Column 4: WhatsApp Helpline & Admin Link */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-sm text-[#012f3d] uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2 text-[#2d5560] text-xs">
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-2 px-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#012f3d] border border-[#25D366]/40 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </button>
              <div className="flex items-center gap-2 pt-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#6ac8c1]" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#6ac8c1]" />
                <span>Karachi, Sindh, Pakistan</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#6ac8c1]/20">
              {isAdmin ? (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="inline-flex items-center gap-1.5 text-[#012f3d] font-bold hover:underline transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
                  <span>Open Zarsal Admin Studio</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[#4a707a] hover:text-[#012f3d] transition cursor-pointer text-[11px]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Store Owner / Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#6ac8c1]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#4a707a] text-[11px]">
          <p>© {new Date().getFullYear()} Zarsal Handmade Crochet Studio. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>EasyPaisa Verified</span>
            <span>•</span>
            <span>Karachi Rider COD</span>
            <span>•</span>
            <span>100% Cotton &amp; Wool Yarn</span>
          </div>
        </div>
      </div>

      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </footer>
  );
};
