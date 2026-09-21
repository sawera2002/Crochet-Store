import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Truck, MapPin } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, settings, clearCart } = useStore();

  if (!isOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const isFreeShipping = cartTotal >= freeShippingThreshold;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : settings.standardShippingFee;
  const grandTotal = cartTotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#012f3d]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#6ac8c1]/30 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#f1ede1] flex items-center justify-between bg-[#faf8f2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#012f3d]" />
            <h2 className="font-serif text-xl font-bold text-[#012f3d]">Zarsal Basket</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-[#6ac8c1]/20 rounded-full text-[#012f3d]">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#4a707a] hover:text-[#012f3d] hover:bg-white transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (Karachi) */}
        <div className="bg-[#faf8f2]/60 p-3.5 border-b border-[#f1ede1] text-xs text-[#2d5560]">
          <div className="flex items-center justify-between mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#6ac8c1]" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold">Free Karachi Delivery Unlocked!</span>
              ) : (
                <span>
                  Add <strong className="text-[#012f3d]">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more for free Karachi delivery
                </span>
              )}
            </span>
            <span className="text-[#012f3d] font-mono font-bold">
              {Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFreeShipping ? 'bg-emerald-500' : 'bg-[#6ac8c1]'
              }`}
              style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#4a707a]">
              <div className="w-16 h-16 rounded-full bg-[#faf8f2] border border-[#6ac8c1]/30 flex items-center justify-center text-3xl mb-3 shadow-2xs">
                🧶
              </div>
              <p className="font-serif text-lg text-[#012f3d] font-bold">Your basket is empty</p>
              <p className="text-xs text-[#2d5560] max-w-xs mt-1">
                Explore our handmade crochet bags, bucket hats, keychains, bracelets, and handkerchiefs!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 bg-[#012f3d] text-[#faf8f2] rounded-xl text-xs font-semibold hover:bg-[#024357] transition cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}`}
                className="flex gap-3.5 p-3 rounded-2xl border border-[#6ac8c1]/25 bg-white hover:border-[#6ac8c1]/60 transition"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#faf8f2] border border-[#6ac8c1]/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#012f3d] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#4a707a] hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.selectedColor && (
                      <span className="text-[11px] text-[#2d5560] font-medium block">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#012f3d] font-sans mt-0.5 block">
                      Rs. {item.product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#6ac8c1]/30 rounded-lg bg-[#faf8f2]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#012f3d] hover:bg-[#6ac8c1]/20 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-[#012f3d] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#012f3d] hover:bg-[#6ac8c1]/20 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-[#012f3d]">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#f1ede1] bg-[#faf8f2] space-y-3">
            <div className="space-y-1.5 text-xs text-[#2d5560]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#012f3d] font-sans">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#6ac8c1]" />
                  <span>Karachi Rider Delivery</span>
                </span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase tracking-wide text-[11px]">
                    FREE
                  </span>
                ) : (
                  <span className="font-bold text-[#012f3d] font-sans">
                    Rs. {shippingFee.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-base font-bold text-[#012f3d] pt-2 border-t border-[#6ac8c1]/30">
                <span className="font-serif">Total Payable</span>
                <span className="font-sans font-serif text-lg text-[#012f3d]">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              id="cart-checkout-proceed-btn"
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-3.5 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-[0.99]"
            >
              <span>Proceed to Karachi Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#6ac8c1]" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#4a707a] px-1 pt-1">
              <span>Accepted: EasyPaisa &amp; COD</span>
              <button
                onClick={clearCart}
                className="hover:text-rose-600 transition underline cursor-pointer"
              >
                Clear basket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
