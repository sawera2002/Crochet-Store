import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { getWhatsAppUrl } from '../../data/contentData';
import {
  X,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Send,
  MessageCircle,
  Trash2
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onDeleteOrder
}) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [internalNote, setInternalNote] = useState(order.statusNotes || '');
  const [copiedTrx, setCopiedTrx] = useState(false);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(order.id, newStatus, internalNote);
  };

  const handleSaveNote = () => {
    onUpdateStatus(order.id, currentStatus, internalNote);
  };

  const handleCopyTrx = () => {
    if (order.easyPaisaDetails?.transactionId) {
      navigator.clipboard.writeText(order.easyPaisaDetails.transactionId);
      setCopiedTrx(true);
      setTimeout(() => setCopiedTrx(false), 2000);
    }
  };

  const handleWhatsAppCustomer = () => {
    const customerPhone = order.customer.whatsapp || order.customer.phone;
    const msg = `Assalam o Alaikum ${order.customer.fullName}! This is Zarsal Handmade Crochet Studio Karachi regarding your order ${order.id}. Current status: ${currentStatus.replace('_', ' ')}. Delivery address: ${order.customer.address}, ${order.customer.karachiArea || order.customer.city}.`;
    const url = getWhatsAppUrl(customerPhone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending_payment', label: 'Pending Payment / TRX Verification', color: 'bg-amber-100 text-amber-900' },
    { value: 'confirmed', label: 'Payment Confirmed / Order Accepted', color: 'bg-blue-100 text-blue-900' },
    { value: 'crafting', label: 'Crafting / Hand-Stitching', color: 'bg-purple-100 text-purple-900' },
    { value: 'shipped', label: 'Dispatched / In Karachi Courier Transit', color: 'bg-indigo-100 text-indigo-900' },
    { value: 'delivered', label: 'Delivered to Customer', color: 'bg-emerald-100 text-emerald-900' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-900' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012f3d]/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div
        id="order-detail-modal"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#6ac8c1]/40 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#f1ede1] flex items-center justify-between bg-[#faf8f2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-bold text-[#012f3d]">
                {order.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.paymentMethod === 'easypaisa'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <span className="text-xs text-[#2d5560] flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <span>Placed {new Date(order.createdAt).toLocaleString()}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppCustomer}
              className="px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#012f3d] border border-[#25D366]/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Message Customer on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp Customer</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 text-[#2d5560] hover:text-[#012f3d] hover:bg-stone-200/60 rounded-xl transition cursor-pointer"
              title="Print Order Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#2d5560] hover:text-[#012f3d] hover:bg-stone-200/60 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer & Delivery Address Card (Requested: order address show ho) */}
          <div className="bg-[#faf8f2] rounded-2xl p-5 border border-[#6ac8c1]/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-serif font-bold text-sm text-[#012f3d] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#6ac8c1]" />
                <span>Customer Information &amp; Delivery Address (Karachi)</span>
              </h4>
              <button
                onClick={handleWhatsAppCustomer}
                className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp ({order.customer.phone})</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-[#4a707a] block font-medium">Customer Full Name</span>
                <strong className="text-sm text-[#012f3d] block mt-0.5">
                  {order.customer.fullName}
                </strong>
                <div className="flex items-center gap-1.5 text-[#2d5560] mt-1 font-mono">
                  <Phone className="w-3 h-3 text-[#6ac8c1]" />
                  <span>{order.customer.phone}</span>
                </div>
                {order.customer.email && (
                  <div className="flex items-center gap-1.5 text-[#2d5560] mt-0.5">
                    <Mail className="w-3 h-3 text-[#6ac8c1]" />
                    <span>{order.customer.email}</span>
                  </div>
                )}
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#6ac8c1]/25">
                <span className="text-[#4a707a] block font-semibold text-[11px] uppercase tracking-wider">
                  Karachi Delivery Address
                </span>
                <p className="text-sm font-semibold text-[#012f3d] mt-1 leading-snug">
                  {order.customer.address}
                </p>
                {order.customer.karachiArea && (
                  <div className="mt-1">
                    <span className="px-2 py-0.5 bg-[#6ac8c1]/20 text-[#012f3d] rounded-md text-[11px] font-bold">
                      Sector: {order.customer.karachiArea}
                    </span>
                  </div>
                )}
                <span className="text-xs text-[#2d5560] block mt-1">
                  City: {order.customer.city || 'Karachi'} {order.customer.postalCode ? `(${order.customer.postalCode})` : ''}
                </span>
                {order.customer.notes && (
                  <div className="mt-2 pt-2 border-t border-[#f1ede1] text-[11px] text-[#2d5560]">
                    <strong className="text-[#012f3d]">Customer Note:</strong> {order.customer.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Verification Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#6ac8c1]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#012f3d] uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#6ac8c1]" />
                Payment Verification
              </span>
              <span className="text-xs font-bold text-[#012f3d]">
                Method: {order.paymentMethod === 'easypaisa' ? 'EasyPaisa Mobile Account' : 'Cash on Delivery (COD)'}
              </span>
            </div>

            {order.paymentMethod === 'easypaisa' && order.easyPaisaDetails ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span>
                    Sender Name: <strong>{order.easyPaisaDetails.senderName}</strong>
                  </span>
                  <span>
                    Sender Mobile: <strong>{order.easyPaisaDetails.senderMobileNumber}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 font-mono">
                  <span>
                    Transaction ID (TRX):{' '}
                    <strong className="text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {order.easyPaisaDetails.transactionId}
                    </strong>
                  </span>
                  <button
                    onClick={handleCopyTrx}
                    className="flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    {copiedTrx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTrx ? 'Copied' : 'Copy TRX'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Cash on Delivery (COD):</strong> Collect exact amount of{' '}
                <strong className="text-amber-950 font-bold">Rs. {order.total.toLocaleString()}</strong> upon parcel delivery via Karachi rider.
              </div>
            )}
          </div>

          {/* Ordered Crochet Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#012f3d] uppercase tracking-wider">
              Items in Order ({order.items.length})
            </h4>
            <div className="divide-y divide-[#f1ede1] border border-[#6ac8c1]/30 rounded-2xl overflow-hidden bg-white">
              {order.items.map((item) => (
                <div key={item.productId} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#6ac8c1]/30 bg-[#faf8f2]"
                    />
                    <div>
                      <h5 className="font-serif font-bold text-xs sm:text-sm text-[#012f3d]">
                        {item.name}
                      </h5>
                      <span className="text-[11px] text-[#4a707a] block">
                        {item.yarnType} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-[#012f3d]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#4a707a] block">
                      @ Rs. {item.price.toLocaleString()} each
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-[#faf8f2] space-y-1 text-xs text-[#012f3d]">
                <div className="flex justify-between text-[#2d5560]">
                  <span>Subtotal:</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#2d5560]">
                  <span>Karachi Rider Delivery:</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#6ac8c1]/30 text-[#012f3d]">
                  <span>Total Payable:</span>
                  <span className="font-serif text-base">Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Controls */}
          <div className="bg-[#faf8f2] rounded-2xl p-4 border border-[#6ac8c1]/30 space-y-3">
            <label className="block text-xs font-bold text-[#012f3d] uppercase tracking-wider">
              Change Order Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-center transition cursor-pointer border ${
                    currentStatus === opt.value
                      ? 'bg-[#012f3d] text-[#faf8f2] border-[#012f3d] shadow-xs'
                      : 'bg-white text-[#012f3d] border-[#6ac8c1]/30 hover:border-[#012f3d]'
                  }`}
                >
                  {opt.label.split('/')[0]}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Internal Tracking / Rider Dispatch Note
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="e.g. Rider assigned, scheduled for DHA route, tracking #1245..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#6ac8c1]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d]"
                />
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#f1ede1] bg-[#faf8f2] flex items-center justify-between">
          <div>
            {onDeleteOrder && (
              <button
                type="button"
                onClick={() => {
                  onDeleteOrder(order.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Delete this order permanently"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Order</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4a707a] hidden sm:inline">
              Zarsal Studio Karachi • Order #{order.id}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs font-bold cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
