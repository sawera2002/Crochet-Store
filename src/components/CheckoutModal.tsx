import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CartItem, PaymentMethod, Order } from '../types';
import { getWhatsAppUrl } from '../data/contentData';
import {
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Printer,
  Copy,
  Check,
  UploadCloud,
  MessageCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directBuyItem?: CartItem | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directBuyItem
}) => {
  const { cart, cartTotal, settings, createOrder } = useStore();

  const itemsToCheckout: CartItem[] = directBuyItem ? [directBuyItem] : cart;

  const checkoutSubtotal = directBuyItem
    ? directBuyItem.product.price * directBuyItem.quantity
    : cartTotal;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const isFreeShipping = checkoutSubtotal >= freeShippingThreshold;
  const shippingFee = itemsToCheckout.length === 0 ? 0 : isFreeShipping ? 0 : settings.standardShippingFee;
  const grandTotal = checkoutSubtotal + shippingFee;

  // Karachi Areas
  const karachiAreas = [
    'Clifton (Blocks 1-9)',
    'Defence / DHA (Phases 1-8)',
    'Gulshan-e-Iqbal',
    'Gulistan-e-Johar',
    'PECHS (Blocks 1-6)',
    'Bahadurabad / Tariq Road',
    'Nazimabad & North Nazimabad',
    'Federal B Area',
    'Saddar & Cantt',
    'Malir Cantt & Model Colony',
    'Korangi & Landhi',
    'North Karachi & Surjani',
    'Bahria Town Karachi',
    'Gulshan-e-Maymar',
    'Karachi Airport / Shah Faisal',
    'Other Karachi Sector'
  ];

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [karachiArea, setKarachiArea] = useState(karachiAreas[0]);
  const [city] = useState('Karachi');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('easypaisa');

  // EasyPaisa fields
  const [senderMobile, setSenderMobile] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [proofFileName, setProofFileName] = useState('');

  // Order completed state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleCopyEasyPaisa = () => {
    navigator.clipboard.writeText(settings.easyPaisaAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFileName(e.target.files[0].name);
    }
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!phone.trim()) errors.phone = 'Valid Pakistani contact number is required (e.g. 0300-1234567)';
    if (!address.trim()) errors.address = 'Detailed street and house address in Karachi is required';
    if (!karachiArea.trim()) errors.karachiArea = 'Please select your Karachi area';

    if (paymentMethod === 'easypaisa') {
      if (!transactionId.trim()) {
        errors.transactionId = 'EasyPaisa Transaction ID (TRX ID) is required';
      }
      if (!senderMobile.trim()) {
        errors.senderMobile = 'EasyPaisa Sender Mobile Number is required';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderData = {
        customer: {
          fullName,
          phone,
          whatsapp: whatsapp || phone,
          email: `${phone.replace(/\D/g, '')}@zarsal.customer`,
          address,
          karachiArea,
          city: 'Karachi',
          notes
        },
        items: itemsToCheckout.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          category: item.product.category,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          yarnType: item.product.yarnType
        })),
        subtotal: checkoutSubtotal,
        shippingFee,
        total: grandTotal,
        paymentMethod,
        easyPaisaDetails:
          paymentMethod === 'easypaisa'
            ? {
                senderMobileNumber: senderMobile,
                transactionId: transactionId.toUpperCase(),
                senderName: fullName,
                paymentProofUrl: proofFileName || undefined
              }
            : undefined
      };

      const placedOrder = createOrder(orderData);
      setCompletedOrder(placedOrder);
      setIsSubmitting(false);
    }, 500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppOrderConfirmation = (order: Order) => {
    const text = `Assalam o Alaikum Zarsal Studio! I just placed order #${order.id} on your website. Name: ${order.customer.fullName}, Area: ${order.customer.karachiArea}, Total: Rs. ${order.total.toLocaleString()} via ${order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery (COD)'}. Please confirm delivery.`;
    const url = getWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012f3d]/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div
        id="checkout-modal-window"
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#6ac8c1]/40 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#f1ede1] flex items-center justify-between bg-[#faf8f2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6ac8c1]/30 text-[#012f3d] text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <span>{completedOrder ? 'Karachi Order Confirmed' : 'Zarsal Express Karachi Checkout'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#012f3d]">
              {completedOrder ? `Order #${completedOrder.id}` : 'Karachi Delivery Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#4a707a] hover:text-[#012f3d] hover:bg-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        {completedOrder ? (
          /* SUCCESS SCREEN */
          <div className="p-6 sm:p-10 space-y-6 text-[#012f3d]">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#6ac8c1]/20 text-[#012f3d] flex items-center justify-center mx-auto shadow-xs border border-[#6ac8c1]/40">
                <CheckCircle2 className="w-10 h-10 text-[#012f3d]" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#012f3d]">
                Shukriya for Ordering with Zarsal!
              </h3>
              <p className="text-[#2d5560] text-sm">
                Your handcrafted crochet piece is booked. Our Karachi rider will deliver directly to your doorstep.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#faf8f2] rounded-2xl p-5 sm:p-6 border border-[#6ac8c1]/30 space-y-4 max-w-2xl mx-auto print:border-none print:shadow-none">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1ede1] pb-4 text-xs">
                <div>
                  <span className="text-[#4a707a] block">Order Number</span>
                  <strong className="text-sm font-mono text-[#012f3d]">{completedOrder.id}</strong>
                </div>
                <div>
                  <span className="text-[#4a707a] block">Payment Method</span>
                  <span className="font-bold text-[#012f3d]">
                    {completedOrder.paymentMethod === 'easypaisa' ? 'EasyPaisa Wallet' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#4a707a] block">Status</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6ac8c1]/20 text-[#012f3d]">
                    {completedOrder.status === 'pending_payment' ? 'Pending TRX Check' : 'Confirmed'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 divide-y divide-[#f1ede1]">
                {completedOrder.items.map((it) => (
                  <div key={it.productId} className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#6ac8c1]/30 bg-white"
                      />
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-[#012f3d]">{it.name}</h5>
                        <span className="text-[11px] text-[#2d5560]">
                          Qty: {it.quantity} × Rs. {it.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-[#012f3d] font-sans">
                      Rs. {(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#f1ede1] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#2d5560]">
                  <span>Subtotal</span>
                  <span className="font-medium font-sans">Rs. {completedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#2d5560]">
                  <span>Karachi Rider Delivery</span>
                  <span>{completedOrder.shippingFee === 0 ? 'FREE' : `Rs. ${completedOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-[#012f3d] font-bold text-sm sm:text-base pt-1">
                  <span>Total Payable</span>
                  <span className="font-sans font-serif text-lg text-[#012f3d]">
                    Rs. {completedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t border-[#f1ede1] pt-3 text-xs text-[#2d5560] space-y-1">
                <p>
                  <strong className="text-[#012f3d]">Recipient:</strong> {completedOrder.customer.fullName} ({completedOrder.customer.phone})
                </p>
                <p>
                  <strong className="text-[#012f3d]">Delivery Address:</strong> {completedOrder.customer.address}, {completedOrder.customer.karachiArea}, Karachi
                </p>
                {completedOrder.easyPaisaDetails?.transactionId && (
                  <p className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-900 font-mono">
                    <strong>EasyPaisa TRX ID:</strong> {completedOrder.easyPaisaDetails.transactionId}
                  </p>
                )}
              </div>
            </div>

            {/* Post-order WhatsApp & Print Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleWhatsAppOrderConfirmation(completedOrder)}
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Order on WhatsApp with Studio</span>
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-5 py-3 rounded-xl border border-[#6ac8c1]/40 hover:bg-[#faf8f2] text-[#012f3d] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handlePlaceOrder} className="p-5 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Karachi Delivery Exclusive Notice */}
            <div className="p-3.5 bg-[#6ac8c1]/15 rounded-2xl border border-[#6ac8c1]/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#012f3d] flex items-center justify-center shrink-0 border border-[#6ac8c1]/40">
                <MapPin className="w-5 h-5 text-[#012f3d]" />
              </div>
              <div className="text-xs">
                <strong className="text-[#012f3d] block font-serif text-sm">
                  Exclusive Karachi Delivery Service
                </strong>
                <span className="text-[#2d5560]">
                  Zarsal delivers exclusively to addresses across Karachi via local parcel riders. Free delivery on orders over Rs. {freeShippingThreshold.toLocaleString()}.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: Customer Information */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#012f3d] flex items-center gap-2">
                  <span>1. Customer &amp; Delivery Address (Karachi)</span>
                </h3>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Siddiqui"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d] ${
                      formErrors.fullName ? 'border-rose-400' : 'border-[#6ac8c1]/30'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                      Phone Number (for Rider) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#4a707a] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl text-[#012f3d] ${
                          formErrors.phone ? 'border-rose-400' : 'border-[#6ac8c1]/30'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                      WhatsApp Number (optional)
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-[#25D366] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="0300 1234567 (if different)"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                      />
                    </div>
                  </div>
                </div>

                {/* Karachi Area Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Karachi Area / Sector *
                  </label>
                  <select
                    value={karachiArea}
                    onChange={(e) => setKarachiArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d] cursor-pointer"
                  >
                    {karachiAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Complete Street Address (House/Flat #, Street, Block) *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat # 304, Al-Karam Heights, Block 13-A, near Main Market"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl text-[#012f3d] ${
                      formErrors.address ? 'border-rose-400' : 'border-[#6ac8c1]/30'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* Special Delivery Instructions / Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Special Delivery Instructions or Custom Stitch Request (optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before arrival, leave with security, gift wrapping..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Payment Method & Order Summary */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#012f3d]">
                  2. Payment Method
                </h3>

                {/* Payment Selector Tabs: EasyPaisa or COD */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'easypaisa'
                        ? 'bg-white border-[#012f3d] shadow-sm ring-2 ring-[#6ac8c1]'
                        : 'bg-[#faf8f2] border-[#6ac8c1]/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#012f3d]">EasyPaisa</span>
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[10px] text-[#2d5560]">Mobile Wallet Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'bg-white border-[#012f3d] shadow-sm ring-2 ring-[#6ac8c1]'
                        : 'bg-[#faf8f2] border-[#6ac8c1]/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#012f3d]">Cash on Delivery</span>
                      <Banknote className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-[10px] text-[#2d5560]">Pay Karachi Rider in Cash</span>
                  </button>
                </div>

                {/* EASYPAISA DETAILS PANEL */}
                {paymentMethod === 'easypaisa' && (
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-950 font-serif">EasyPaisa Account Details</strong>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                        Official Merchant
                      </span>
                    </div>

                    <div className="space-y-1 text-emerald-950">
                      <p>
                        Account Title: <strong>{settings.easyPaisaAccountTitle}</strong>
                      </p>
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-200 font-mono">
                        <span className="font-bold text-sm text-emerald-950">
                          {settings.easyPaisaAccountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyEasyPaisa}
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-md text-[11px] font-sans font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedAccount ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Please send <strong>Rs. {grandTotal.toLocaleString()}</strong> to the account above, then enter your Transaction ID (TRX) below:
                    </p>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                        Transaction ID (TRX ID) *
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 1928471203"
                        className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-emerald-950 font-mono ${
                          formErrors.transactionId ? 'border-rose-400' : 'border-emerald-300'
                        }`}
                      />
                      {formErrors.transactionId && (
                        <p className="text-[10px] text-rose-600 mt-1">{formErrors.transactionId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                        Sender EasyPaisa Mobile Number *
                      </label>
                      <input
                        type="text"
                        value={senderMobile}
                        onChange={(e) => setSenderMobile(e.target.value)}
                        placeholder="e.g. 0345 9876543"
                        className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-emerald-950 font-mono ${
                          formErrors.senderMobile ? 'border-rose-400' : 'border-emerald-300'
                        }`}
                      />
                      {formErrors.senderMobile && (
                        <p className="text-[10px] text-rose-600 mt-1">{formErrors.senderMobile}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* COD DETAILS PANEL */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                    <strong className="block text-amber-950 font-serif">Cash on Delivery Notice:</strong>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Please have the exact amount of <strong>Rs. {grandTotal.toLocaleString()}</strong> ready in cash for the Karachi rider upon parcel handover.
                    </p>
                  </div>
                )}

                {/* Order Cost Breakdown */}
                <div className="bg-[#faf8f2] rounded-2xl p-4 border border-[#6ac8c1]/30 space-y-2 text-xs text-[#012f3d]">
                  <div className="flex justify-between text-[#2d5560]">
                    <span>Items ({itemsToCheckout.reduce((s, i) => s + i.quantity, 0)}):</span>
                    <span className="font-medium font-sans">Rs. {checkoutSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#2d5560]">
                    <span>Karachi Rider Delivery:</span>
                    <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                      {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#012f3d] font-bold text-sm pt-2 border-t border-[#f1ede1]">
                    <span>Grand Total:</span>
                    <span className="font-serif text-base text-[#012f3d]">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || itemsToCheckout.length === 0}
                  className="w-full py-3.5 px-4 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-2xl font-bold text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming with Karachi Workshop...</span>
                  ) : (
                    <>
                      <span>Place Karachi Order</span>
                      <ArrowRight className="w-4 h-4 text-[#6ac8c1]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
