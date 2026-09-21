import React from 'react';
import { Product, ProductCategory, NavigationTab } from '../../types';
import { useStore } from '../../context/StoreContext';
import { NewCollectionCarousel } from '../home/NewCollectionCarousel';
import { getWhatsAppUrl, CROCHET_BENEFITS } from '../../data/contentData';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Truck,
  Heart,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  onOpenProductDetails: (product: Product) => void;
  onNavigateToShop: (category?: ProductCategory) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenProductDetails,
  onNavigateToShop,
  onNavigate
}) => {
  const { settings } = useStore();

  const categories: {
    id: ProductCategory;
    name: string;
    icon: string;
    desc: string;
  }[] = [
    { id: 'bags', name: 'Bags & Totes', icon: '👜', desc: 'Granny Square & Shoulder Bags' },
    { id: 'keychains', name: 'Keychains & Charms', icon: '🍓', desc: 'Strawberry & Tulip Amigurumi' },
    { id: 'hats', name: 'Hats & Beanies', icon: '👒', desc: 'Daisy Bucket Hats & Knit Caps' },
    { id: 'bracelets', name: 'Flora Bracelets', icon: '🌸', desc: 'Handwoven Friendship Bands' },
    { id: 'handkerchiefs', name: 'Lace Handkerchiefs', icon: '🪡', desc: 'Heirloom Crochet Edging' }
  ];

  const handleWhatsAppInquiry = () => {
    const url = getWhatsAppUrl(
      settings.whatsappNumber,
      `Hello ${settings.storeName}! I want to inquire about your handmade crochet pieces and custom orders in Karachi.`
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#faf8f2] text-[#012f3d]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 border-b border-[#6ac8c1]/20">
        {/* Soft decorative blur circles with custom palette */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#6ac8c1]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#012f3d]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#6ac8c1] animate-pulse" />
              <span>Zarsal • Karachi's Handmade Crochet Studio</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#012f3d] tracking-tight leading-[1.12]">
              Artisan Crochet &amp; Wool, <br />
              <span className="italic font-normal text-[#2d5560]">
                hand-knitted petal by petal in Karachi.
              </span>
            </h1>

            <p className="mt-4 text-[#2d5560] text-sm sm:text-base leading-relaxed max-w-2xl">
              Welcome to <strong>Zarsal</strong>. We create bespoke crochet bags, daisy bucket hats,
              amigurumi keychains, floral wristlets, and lace handkerchiefs using 100% natural milk cotton.
              Delivered directly across <strong>Karachi</strong> with <strong>Cash on Delivery (COD)</strong>,{' '}
              <strong>EasyPaisa</strong>, and instant <strong>WhatsApp orders</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                onClick={() => onNavigateToShop('all')}
                className="px-6 py-3 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#6ac8c1]" />
                <span>Explore Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="px-5 py-3 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </button>
            </div>

            {/* Karachi Delivery Scope Note */}
            <div className="flex items-center gap-2 mt-5 text-xs font-semibold text-[#012f3d] bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#6ac8c1]/30 w-fit">
              <MapPin className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <span>Exclusive Karachi Delivery Only • Clifton, DHA, Gulshan, Johar, North Nazimabad &amp; all areas</span>
            </div>
          </div>

          {/* Quick Category Jump Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigateToShop(cat.id)}
                className="p-3.5 rounded-2xl bg-white hover:bg-white/90 border border-[#6ac8c1]/30 hover:border-[#012f3d] text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between group"
              >
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <div>
                  <span className="font-serif font-bold text-sm text-[#012f3d] block leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-[#2d5560] block leading-tight mt-1">
                    {cat.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Karachi Delivery Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-[#6ac8c1]/20 text-xs text-[#2d5560]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-[#6ac8c1]/40 flex items-center justify-center text-[#012f3d] shadow-2xs shrink-0">
                <Truck className="w-4 h-4 text-[#012f3d]" />
              </div>
              <div>
                <span className="font-bold text-[#012f3d] block text-xs">Karachi Rider Delivery</span>
                <span className="text-[11px] text-[#2d5560]">Delivered in 2-3 business days</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-[#6ac8c1]/40 flex items-center justify-center text-[#012f3d] shadow-2xs shrink-0">
                <Sparkles className="w-4 h-4 text-[#6ac8c1]" />
              </div>
              <div>
                <span className="font-bold text-[#012f3d] block text-xs">EasyPaisa &amp; COD</span>
                <span className="text-[11px] text-[#2d5560]">Pay on arrival or mobile wallet</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-[#6ac8c1]/40 flex items-center justify-center text-[#012f3d] shadow-2xs shrink-0">
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <span className="font-bold text-[#012f3d] block text-xs">100% Milk Cotton &amp; Wool</span>
                <span className="text-[11px] text-[#2d5560]">Soft crochet yarn, no scratching</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-[#6ac8c1]/40 flex items-center justify-center text-[#012f3d] shadow-2xs shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <span className="font-bold text-[#012f3d] block text-xs">Quality Guarantee</span>
                <span className="text-[11px] text-[#2d5560]">Individually hand-knitted &amp; checked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW COLLECTION CAROUSEL (Requested: Just New Collection shown on Home in Carousel) */}
      <NewCollectionCarousel onOpenProductDetails={onOpenProductDetails} />

      {/* Benefits Preview Section */}
      <section className="py-14 bg-white border-y border-[#6ac8c1]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6ac8c1]">
                Crochet Benefits • Craft Advantages
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#012f3d] mt-1">
                Why Choose Zarsal Handmade Crochet?
              </h2>
              <p className="text-[#2d5560] text-sm mt-1 max-w-xl">
                Every stitch is knotted by hand with love. Here is why natural crochet is far superior to factory plastic fashion.
              </p>
            </div>

            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#012f3d] hover:text-[#024357] underline underline-offset-4 cursor-pointer"
            >
              <span>Read Full Story &amp; Customer Reviews in About</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6ac8c1]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CROCHET_BENEFITS.slice(0, 3).map((benefit) => (
              <div
                key={benefit.id}
                className="p-6 rounded-2xl bg-[#faf8f2] border border-[#6ac8c1]/30 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl mb-3 block">{benefit.icon}</span>
                  <h3 className="font-serif font-bold text-lg text-[#012f3d]">
                    {benefit.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#6ac8c1] block mb-2 font-sans">
                    {benefit.urduTitle}
                  </span>
                  <p className="text-xs text-[#2d5560] leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct WhatsApp Custom Order Banner */}
      <section className="py-12 bg-[#faf8f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#012f3d] text-[#faf8f2] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#6ac8c1] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6ac8c1]" />
                <span>Custom Handmade Orders Welcome in Karachi</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Want a custom color, size, or personalized design?
              </h3>
              <p className="text-sm text-[#faf8f2]/80 leading-relaxed">
                Send us a picture or your preferred colors on WhatsApp. Our Karachi artisans hand-crochet custom bags, initials, and gift sets within 3-5 days.
              </p>
            </div>

            <button
              onClick={handleWhatsAppInquiry}
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20b858] text-white rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-lg transition cursor-pointer active:scale-95 shrink-0"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chat with Us on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
