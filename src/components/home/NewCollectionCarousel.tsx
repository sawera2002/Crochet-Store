import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppUrl } from '../../data/contentData';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Eye,
  MessageCircle,
  Star,
  Check
} from 'lucide-react';

interface NewCollectionCarouselProps {
  onOpenProductDetails: (product: Product) => void;
}

export const NewCollectionCarousel: React.FC<NewCollectionCarouselProps> = ({
  onOpenProductDetails
}) => {
  const { products, addToCart, settings } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Get products marked as new collection, or newly added items first
  const newCollectionProducts = useMemo(() => {
    const list = products.filter((p) => p.isNewCollection || p.isFeatured);
    return list.length > 0 ? list : products.slice(0, 6);
  }, [products]);

  // Responsive items per view
  // On desktop we show 3 items, tablet 2, mobile 1
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const maxIndex = Math.max(0, newCollectionProducts.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleWhatsAppOrder = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello Zarsal! I would like to order this New Collection item: *${product.name}* (Rs. ${product.price}) for delivery in Karachi. Is it available?`;
    const url = getWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (newCollectionProducts.length === 0) return null;

  const visibleItems = newCollectionProducts.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-12 bg-[#faf8f2] relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#6ac8c1]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header with Title and Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <span>Fresh Crochet Collection • Fresh Off The Hook</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#012f3d] tracking-tight">
              New Collection Carousel
            </h2>
            <p className="text-[#2d5560] text-sm mt-1.5 max-w-xl">
              Latest handmade drops posted by our master craftswomen. Stitched with pure milk cotton, soft wool, and delicate petals for Karachi.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3 self-end">
            <span className="text-xs text-[#2d5560] font-medium hidden sm:inline">
              Showing {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, newCollectionProducts.length)} of {newCollectionProducts.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous items"
                className="w-10 h-10 rounded-xl bg-white border border-[#6ac8c1]/30 hover:border-[#012f3d] text-[#012f3d] hover:bg-[#012f3d] hover:text-[#faf8f2] flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next items"
                className="w-10 h-10 rounded-xl bg-white border border-[#6ac8c1]/30 hover:border-[#012f3d] text-[#012f3d] hover:bg-[#012f3d] hover:text-[#faf8f2] flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((product) => {
            const isJustAdded = !!addedIds[product.id];
            return (
              <div
                key={product.id}
                onClick={() => onOpenProductDetails(product)}
                className="group bg-white rounded-2xl border border-[#6ac8c1]/25 hover:border-[#6ac8c1] transition-all duration-300 hover:shadow-md overflow-hidden flex flex-col cursor-pointer relative"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-4/3 bg-[#f5f1e8] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#012f3d]/5 group-hover:bg-transparent transition-colors" />

                  {/* New Collection Tag */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="px-2.5 py-1 rounded-lg bg-[#012f3d] text-[#faf8f2] text-[11px] font-semibold tracking-wide shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#6ac8c1]" />
                      <span>New Arrival</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#6ac8c1] text-[#012f3d] text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                      Crochet
                    </span>
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg text-xs font-bold text-[#012f3d] flex items-center gap-1 shadow-2xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>

                  {/* Quick View Floating button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#012f3d]/20 backdrop-blur-[1px]">
                    <span className="px-3.5 py-1.5 bg-white text-[#012f3d] text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-[#6ac8c1]" />
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category and Yarn */}
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#2d5560] mb-1.5 font-medium">
                      <span className="uppercase tracking-wider font-semibold text-[#012f3d]">
                        {product.category}
                      </span>
                      <span className="truncate max-w-[170px] text-right">
                        {product.yarnType}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif font-bold text-lg text-[#012f3d] group-hover:text-[#012f3d] leading-snug line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-[#2d5560] line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-4 mt-3 border-t border-[#f1ede1]">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xs text-[#2d5560] block -mb-0.5">Price (Karachi)</span>
                        <span className="font-serif text-xl font-bold text-[#012f3d]">
                          Rs. {product.price.toLocaleString()}
                        </span>
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-[#4a707a] line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Dual Action Buttons: Cart & WhatsApp */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2]'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#6ac8c1]" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleWhatsAppOrder(product, e)}
                        className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#012f3d] border border-[#25D366]/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        title="Order this directly on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-[#012f3d]'
                  : 'w-2 bg-[#6ac8c1]/40 hover:bg-[#6ac8c1]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
