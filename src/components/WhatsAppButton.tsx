import React from 'react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../data/contentData';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  const handleClick = () => {
    const url = getWhatsAppUrl(
      settings.whatsappNumber,
      `Hello ${settings.storeName}! I am interested in your handmade crochet products in Karachi. Could you please share more details?`
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-40 flex items-center group cursor-pointer"
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-full shadow-lg hover:shadow-xl border border-[#6ac8c1]/40 transition-all duration-300 transform group-hover:scale-105 active:scale-95"
        title="Chat with Zarsal on WhatsApp"
      >
        <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs shrink-0">
          <MessageCircle className="w-4 h-4 fill-white text-white" />
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6ac8c1] block leading-none">
            Karachi Support
          </span>
          <span className="text-xs font-bold leading-tight block text-white mt-0.5">
            Order on WhatsApp
          </span>
        </div>
      </button>
    </aside>
  );
};
