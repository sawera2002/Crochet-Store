import React from 'react';
import { Trash2, AlertTriangle, X, Package, ShoppingBag } from 'lucide-react';
import { Product, Order } from '../../types';

export type DeleteTarget =
  | { type: 'product'; product: Product }
  | { type: 'order'; order: Order }
  | { type: 'multiple-orders'; orderIds: string[] }
  | { type: 'multiple-products'; productIds: string[] }
  | { type: 'clear-orders'; count: number }
  | { type: 'reset-catalog' };

interface DeleteConfirmationModalProps {
  target: DeleteTarget | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  target,
  onClose,
  onConfirm
}) => {
  if (!target) return null;

  return (
    <div
      id="delete-confirmation-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#012f3d]/65 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="delete-confirmation-dialog"
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-200/80 animate-in zoom-in-95 duration-150 space-y-5"
      >
        {/* Header Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#4a707a] hover:text-[#012f3d] hover:bg-[#faf8f2] transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on target */}
        {target.type === 'product' && (
          <div className="space-y-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#012f3d]">
                Delete Crochet Product?
              </h3>
              <p className="text-xs text-[#2d5560] mt-1">
                Are you sure you want to permanently remove this piece from the catalog? Customers will no longer see or purchase it.
              </p>
            </div>

            {/* Product Card Preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#faf8f2] border border-[#f1ede1]">
              <img
                src={target.product.image}
                alt={target.product.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#6ac8c1]/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-sm text-[#012f3d] truncate">
                  {target.product.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#4a707a]">
                  <span className="capitalize font-medium">{target.product.category}</span>
                  <span>•</span>
                  <span className="font-bold text-[#012f3d]">Rs. {target.product.price.toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-[#6ac8c1] block mt-0.5 font-mono">
                  Stock: {target.product.stock} units left
                </span>
              </div>
            </div>
          </div>
        )}

        {target.type === 'order' && (
          <div className="space-y-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#012f3d]">
                Delete Order Record?
              </h3>
              <p className="text-xs text-[#2d5560] mt-1">
                This will permanently remove the order record from your studio database.
              </p>
            </div>

            {/* Order Preview */}
            <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#f1ede1] space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#012f3d]">{target.order.id}</span>
                <span className="font-bold text-[#012f3d]">Rs. {target.order.total.toLocaleString()}</span>
              </div>
              <div className="text-[#2d5560]">
                <strong>Customer:</strong> {target.order.customer.fullName} ({target.order.customer.phone})
              </div>
              <div className="text-[#4a707a] truncate">
                <strong>Address:</strong> {target.order.customer.address}, {target.order.customer.karachiArea || target.order.customer.city}
              </div>
              <div className="text-[11px] text-[#4a707a]">
                <strong>Items:</strong> {target.order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
              </div>
            </div>
          </div>
        )}

        {target.type === 'multiple-orders' && (
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-[#012f3d]">
              Delete {target.orderIds.length} Selected Orders?
            </h3>
            <p className="text-xs text-[#2d5560] leading-relaxed">
              You are about to delete <strong>{target.orderIds.length} orders</strong> from the admin list. This will remove their customer records and delivery address history.
            </p>
          </div>
        )}

        {target.type === 'multiple-products' && (
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-[#012f3d]">
              Delete {target.productIds.length} Selected Products?
            </h3>
            <p className="text-xs text-[#2d5560] leading-relaxed">
              You are about to delete <strong>{target.productIds.length} products</strong> from the catalog.
            </p>
          </div>
        )}

        {target.type === 'clear-orders' && (
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5" />
              <span>Clear All Orders?</span>
            </h3>
            <p className="text-xs text-[#2d5560] leading-relaxed">
              This will permanently delete all <strong>{target.count} order records</strong> currently in the system. This action cannot be reversed.
            </p>
          </div>
        )}

        {target.type === 'reset-catalog' && (
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5" />
              <span>Reset Catalog to Defaults?</span>
            </h3>
            <p className="text-xs text-[#2d5560] leading-relaxed">
              This will restore all default crochet pieces and demo orders. Any newly added products or custom edits will be replaced with the original collection.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#6ac8c1]/30 bg-[#faf8f2] hover:bg-[#6ac8c1]/10 text-xs font-semibold text-[#012f3d] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
