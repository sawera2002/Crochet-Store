import React from 'react';
import { ProductCategory } from '../types';
import { Sparkles, Heart, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
  selectedCategory: ProductCategory;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  const categoryHighlights: {
    id: ProductCategory;
    name: string;
    icon: string;
    desc: string;
  }[] = [
    { id: 'bags', name: 'Bags', icon: '👜', desc: 'Granny Square & Totes' },
    { id: 'hats', name: 'Hats', icon: '👒', desc: 'Daisy Bucket Hats' },
    { id: 'bracelets', name: 'Bracelets', icon: '🌸', desc: 'Handwoven Floral Bands' },
    { id: 'keychains', name: 'Keychains', icon: '🍓', desc: 'Amigurumi Charms' },
    { id: 'handkerchiefs', name: 'Handkerchiefs', icon: '🪡', desc: 'Vintage Lace Edging' }
  ];

  return (
    <div className="relative bg-stone-50/70 border-b border-stone-200/60 overflow-hidden">
      {/* Decorative subtle background blooms */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose-50/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
        <div className="max-w-3xl">
          {/* Subtle Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Slow Crafted • Natural Milk Cotton • 100% Handmade</span>
          </div>

          {/* Display Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
            Artisan Crochet, <br className="hidden sm:inline" />
            <span className="italic font-normal text-stone-700">stitched petal by petal.</span>
          </h1>

          <p className="mt-3.5 text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Explore our boutique collection of lovingly hand-knitted bags, daisy bucket hats,
            flower bracelets, amigurumi keychains, and heirloom lace handkerchiefs.
            Easy checkout with <strong>EasyPaisa</strong> &amp; <strong>Cash on Delivery</strong>.
          </p>

          {/* Quick Category Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-8">
            {categoryHighlights.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-102'
                      : 'bg-white text-stone-800 border-stone-200/80 hover:border-stone-400 hover:shadow-2xs'
                  }`}
                >
                  <span className="text-xl mb-1">{cat.icon}</span>
                  <div>
                    <span className="font-serif font-bold text-sm block leading-tight">
                      {cat.name}
                    </span>
                    <span
                      className={`text-[10px] block leading-tight mt-0.5 ${
                        isSelected ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {cat.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-stone-200/70 text-xs text-stone-600">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 shadow-2xs">
              <Truck className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block text-xs">Nationwide Delivery</span>
              <span className="text-[11px] text-stone-500">Free on orders above Rs. 2,500</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block text-xs">EasyPaisa &amp; COD</span>
              <span className="text-[11px] text-stone-500">Quick mobile wallet or pay on arrival</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 shadow-2xs">
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block text-xs">Small Batch Artisan</span>
              <span className="text-[11px] text-stone-500">Individual stitch care &amp; packaging</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block text-xs">Quality Guarantee</span>
              <span className="text-[11px] text-stone-500">Premium combed cotton yarn only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
