import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../data/contentData';
import {
  X,
  ShoppingBag,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Ruler,
  Heart,
  MessageCircle,
  MapPin
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantBuy: (product: Product, quantity: number, color?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInstantBuy
}) => {
  const { addToCart, settings } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!product) return null;

  const activeColor = selectedColor || product.colors?.[0] || 'Original Pattern';

  const handleAddToCart = () => {
    addToCart(product, quantity, activeColor);
    onClose();
  };

  const handleBuyNow = () => {
    onInstantBuy(product, quantity, activeColor);
    onClose();
  };

  const handleWhatsAppOrder = () => {
    const text = `Assalam o Alaikum Zarsal Studio! I want to order the "${product.name}" (${activeColor}, Qty: ${quantity}) for Rs. ${(product.price * quantity).toLocaleString()} to my address in Karachi.`;
    const url = getWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012f3d]/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div
        id="product-detail-modal"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#6ac8c1]/40 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-[#faf8f2] text-[#2d5560] hover:text-[#012f3d] transition shadow-xs border border-[#6ac8c1]/30 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative bg-[#faf8f2] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#f1ede1]">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner bg-white border border-[#6ac8c1]/30">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider text-[#012f3d] shadow-2xs border border-[#6ac8c1]/30">
                {product.category}
              </div>
              {product.craftTimeHours && (
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#012f3d]/90 backdrop-blur-xs text-[#faf8f2] rounded-xl text-xs flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-[#6ac8c1]" />
                  <span>{product.craftTimeHours}h Hand-Crocheted</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#012f3d] bg-[#6ac8c1]/20 px-2.5 py-0.5 rounded-md border border-[#6ac8c1]/30">
                  {product.category} • Karachi
                </span>
                <div className="flex items-center gap-1 text-xs text-[#2d5560]">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[#012f3d]">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#012f3d] leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-[#012f3d] font-sans">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#4a707a] line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="ml-auto text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="ml-auto text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Hand-Crocheted on Order
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-[#2d5560] text-xs sm:text-sm mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#f1ede1] text-xs">
                <div className="bg-[#faf8f2] p-2.5 rounded-xl border border-[#6ac8c1]/20">
                  <span className="text-[#4a707a] flex items-center gap-1 mb-0.5 font-medium">
                    <Layers className="w-3 h-3 text-[#6ac8c1]" /> Yarn Material
                  </span>
                  <span className="text-[#012f3d] font-bold line-clamp-1">{product.yarnType}</span>
                </div>
                {product.dimensions && (
                  <div className="bg-[#faf8f2] p-2.5 rounded-xl border border-[#6ac8c1]/20">
                    <span className="text-[#4a707a] flex items-center gap-1 mb-0.5 font-medium">
                      <Ruler className="w-3 h-3 text-[#6ac8c1]" /> Sizing
                    </span>
                    <span className="text-[#012f3d] font-bold line-clamp-1">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-[#012f3d] uppercase tracking-wider mb-2">
                    Colorway: <span className="font-bold text-[#6ac8c1]">{activeColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          activeColor === c
                            ? 'bg-[#012f3d] text-[#faf8f2] border-[#012f3d] shadow-xs'
                            : 'bg-[#faf8f2] text-[#012f3d] border-[#6ac8c1]/30 hover:border-[#012f3d]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Buttons */}
            <div className="space-y-3 pt-3 border-t border-[#f1ede1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-[#6ac8c1]/30 rounded-xl bg-[#faf8f2] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#012f3d] hover:bg-white font-bold transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-[#012f3d] text-sm font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#012f3d] hover:bg-white font-bold transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-[#2d5560]">
                  Subtotal:{' '}
                  <span className="font-bold text-[#012f3d] font-sans text-sm">
                    Rs. {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-3 rounded-xl border border-[#012f3d] text-[#012f3d] hover:bg-[#faf8f2] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#6ac8c1]" />
                  <span>Add to Basket</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-3 rounded-xl bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#6ac8c1]" />
                  <span>Quick Checkout</span>
                </button>
              </div>

              {/* WhatsApp Direct Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#012f3d] border border-[#25D366]/40 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>Order Directly on WhatsApp</span>
              </button>

              {/* Care tip */}
              <p className="text-[11px] text-[#2d5560] text-center flex items-center justify-center gap-1.5 pt-1">
                <Heart className="w-3 h-3 text-[#6ac8c1] fill-[#6ac8c1]" />
                <span>Karachi Rider Delivery • EasyPaisa &amp; Cash on Delivery</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
