import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../data/contentData';
import { ShoppingBag, Star, Clock, Sparkles, MessageCircle, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, settings } = useStore();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hello Zarsal! I would like to order *${product.name}* (Rs. ${product.price}) for delivery in Karachi. Is this in stock?`;
    const url = getWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-2xl border border-[#6ac8c1]/25 hover:border-[#6ac8c1] p-3.5 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#faf8f2] mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-xs text-[#012f3d] text-[10px] font-bold rounded-md uppercase tracking-wider shadow-2xs border border-[#6ac8c1]/30">
              {product.category}
            </span>
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md shadow-2xs">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
            {product.isNewCollection && (
              <span className="px-2 py-0.5 bg-[#6ac8c1] text-[#012f3d] text-[10px] font-bold rounded-md shadow-2xs">
                New Crochet
              </span>
            )}
            {product.isFeatured && !product.isNewCollection && (
              <div className="px-2 py-0.5 bg-amber-400 text-[#012f3d] text-[10px] font-bold rounded-md flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>Bestseller</span>
              </div>
            )}
          </div>

          {/* Quick Crafting Time Badge */}
          {product.craftTimeHours && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-[#012f3d]/80 backdrop-blur-xs text-[#faf8f2] text-[10px] rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#6ac8c1]" />
              <span>{product.craftTimeHours}h craft</span>
            </div>
          )}
        </div>

        {/* Category & Yarn Info */}
        <div className="text-[11px] text-[#4a707a] font-medium tracking-wide uppercase mb-1 line-clamp-1">
          {product.yarnType}
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-base text-[#012f3d] line-clamp-1 group-hover:text-[#024357] transition">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-[#2d5560] text-xs mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer / Price & Actions */}
      <div className="pt-3 mt-3 border-t border-[#f1ede1] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-[#012f3d]">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#4a707a] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#2d5560]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-[#012f3d]">{product.rating.toFixed(1)}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Buttons: Add to Cart and WhatsApp */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2]'
            }`}
            title="Add to Shopping Cart"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#6ac8c1]" />
                <span>Add</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#012f3d] border border-[#25D366]/40 flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
            title="Order directly via WhatsApp in Karachi"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
