import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, PaymentMethod } from '../../types';
import { getWhatsAppUrl } from '../../data/contentData';
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  TrendingUp,
  CreditCard,
  Phone,
  Eye,
  Settings,
  Sparkles,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailModal } from './OrderDetailModal';
import { AdminLoginModal } from '../AdminLoginModal';
import { DeleteConfirmationModal, DeleteTarget } from './DeleteConfirmationModal';

export const AdminPanel: React.FC = () => {
  const {
    isAdmin,
    orders,
    products,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    updateOrderStatus,
    deleteOrder,
    deleteMultipleOrders,
    clearAllOrders,
    resetProductsToDefault,
    updateSettings,
    logoutAdmin,
    setActiveTab
  } = useStore();

  const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // In-App Confirmation Modal state (Replaces blocked window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  // Orders Management States & Selection
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Products Management States & Selection
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Store Settings Form States
  const [epTitle, setEpTitle] = useState(settings.easyPaisaAccountTitle);
  const [epNumber, setEpNumber] = useState(settings.easyPaisaAccountNumber);
  const [freeThreshold, setFreeThreshold] = useState(settings.freeShippingThreshold);
  const [stdShipping, setStdShipping] = useState(settings.standardShippingFee);
  const [waNumber, setWaNumber] = useState(settings.whatsappNumber || '03047891234');
  const [phoneSupport, setPhoneSupport] = useState(settings.contactPhone || '+92 304 7891234');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customer.phone.includes(orderSearch) ||
        (order.customer.address && order.customer.address.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (order.customer.karachiArea && order.customer.karachiArea.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (order.easyPaisaDetails?.transactionId &&
          order.easyPaisaDetails.transactionId.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesPayment = orderPaymentFilter === 'all' || order.paymentMethod === orderPaymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, orderSearch, orderStatusFilter, orderPaymentFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        prod.yarnType.toLowerCase().includes(productSearch.toLowerCase()) ||
        prod.description.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCategory =
        productCategoryFilter === 'all' || prod.category === productCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Financial Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending_payment').length;
  const craftingCount = orders.filter((o) => o.status === 'crafting' || o.status === 'confirmed').length;

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#faf8f2]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#6ac8c1]/40 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#012f3d]/10 text-[#012f3d] flex items-center justify-center mx-auto border border-[#6ac8c1]/30">
            <Lock className="w-8 h-8 text-[#012f3d]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#012f3d]">Restricted Admin Portal</h2>
          <p className="text-[#2d5560] text-xs sm:text-sm">
            Only authorized administrators can access the checkout list, customer delivery addresses, and manage crochet products.
          </p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full py-3 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl font-semibold text-sm transition cursor-pointer shadow-md"
          >
            Enter Admin Passcode
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs text-[#2d5560] hover:text-[#012f3d] underline transition cursor-pointer"
          >
            Return to Zarsal Storefront
          </button>
        </div>
        <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    );
  }

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, prodData);
    } else {
      addProduct(prodData);
    }
  };

  const handleDeleteProductConfirm = (prod: Product) => {
    setDeleteTarget({ type: 'product', product: prod });
  };

  const handleDeleteOrderConfirm = (order: Order) => {
    setDeleteTarget({ type: 'order', order });
  };

  const handleExecuteDelete = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case 'product':
        deleteProduct(deleteTarget.product.id);
        setSelectedProductIds((prev) => prev.filter((id) => id !== deleteTarget.product.id));
        break;
      case 'order':
        deleteOrder(deleteTarget.order.id);
        setSelectedOrderIds((prev) => prev.filter((id) => id !== deleteTarget.order.id));
        break;
      case 'multiple-orders':
        deleteMultipleOrders(deleteTarget.orderIds);
        setSelectedOrderIds([]);
        break;
      case 'multiple-products':
        deleteMultipleProducts(deleteTarget.productIds);
        setSelectedProductIds([]);
        break;
      case 'clear-orders':
        clearAllOrders();
        setSelectedOrderIds([]);
        break;
      case 'reset-catalog':
        resetProductsToDefault();
        setSelectedOrderIds([]);
        setSelectedProductIds([]);
        break;
    }
    setDeleteTarget(null);
  };

  // Order Multi-Select Handlers
  const allOrdersSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.includes(o.id));

  const toggleSelectAllOrders = () => {
    if (allOrdersSelected) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Product Multi-Select Handlers
  const allProductsSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProductIds.includes(p.id));

  const toggleSelectAllProducts = () => {
    if (allProductsSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      easyPaisaAccountTitle: epTitle,
      easyPaisaAccountNumber: epNumber,
      freeShippingThreshold: Number(freeThreshold),
      standardShippingFee: Number(stdShipping),
      whatsappNumber: waNumber,
      contactPhone: phoneSupport
    });
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const customerPhone = order.customer.whatsapp || order.customer.phone;
    const msg = `Assalam o Alaikum ${order.customer.fullName}! This is Zarsal Studio regarding your order ${order.id}. Delivery address: ${order.customer.address}, ${order.customer.karachiArea || order.customer.city}. Total: Rs. ${order.total.toLocaleString()}.`;
    const url = getWhatsAppUrl(customerPhone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Pending TRX</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">Confirmed</span>;
      case 'crafting':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">Crafting</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">With Rider</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">Cancelled</span>;
    }
  };

  return (
    <div className="bg-[#faf8f2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        {/* Admin Header & Mode Switch */}
        <div className="bg-[#012f3d] text-[#faf8f2] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#6ac8c1]/30">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6ac8c1] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zarsal Admin Control Studio • Karachi</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Orders &amp; Crochet Inventory Manager
            </h1>
            <p className="text-[#faf8f2]/80 text-xs sm:text-sm mt-1 max-w-xl">
              View customer delivery addresses in Karachi, verify EasyPaisa payments, dispatch riders, and publish new collection pieces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#6ac8c1]" />
              <span>View Customer Website</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2.5 bg-rose-900/60 hover:bg-rose-900 text-rose-100 rounded-xl text-xs sm:text-sm font-semibold border border-rose-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* KPI Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#6ac8c1]/30 shadow-2xs">
            <span className="text-xs text-[#2d5560] font-medium block">Total Customer Orders</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-[#012f3d] font-sans">{orders.length}</span>
              <span className="text-xs text-[#6ac8c1] font-bold">All Time</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#6ac8c1]/30 shadow-2xs">
            <span className="text-xs text-[#2d5560] font-medium block">Pending EasyPaisa Verification</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-amber-700 font-sans">{pendingCount}</span>
              <span className="text-xs text-amber-600 font-bold">Needs Action</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#6ac8c1]/30 shadow-2xs">
            <span className="text-xs text-[#2d5560] font-medium block">In Crafting / Courier Rider</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-indigo-700 font-sans">{craftingCount}</span>
              <span className="text-xs text-indigo-600 font-bold">Karachi Transit</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#6ac8c1]/30 shadow-2xs">
            <span className="text-xs text-[#2d5560] font-medium block">Total Order Revenue</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-emerald-800 font-sans">
                Rs. {totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-600 font-bold">PKR</span>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-[#6ac8c1]/30 gap-6">
          <button
            onClick={() => setAdminTab('orders')}
            className={`pb-3 text-sm font-serif font-bold transition-all relative cursor-pointer ${
              adminTab === 'orders'
                ? 'text-[#012f3d] border-b-2 border-[#012f3d]'
                : 'text-[#4a707a] hover:text-[#012f3d]'
            }`}
          >
            <span>Customer Orders List &amp; Addresses ({orders.length})</span>
            {pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-sans font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`pb-3 text-sm font-serif font-bold transition-all relative cursor-pointer ${
              adminTab === 'products'
                ? 'text-[#012f3d] border-b-2 border-[#012f3d]'
                : 'text-[#4a707a] hover:text-[#012f3d]'
            }`}
          >
            <span>Manage Crochet Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`pb-3 text-sm font-serif font-bold transition-all relative cursor-pointer ${
              adminTab === 'settings'
                ? 'text-[#012f3d] border-b-2 border-[#012f3d]'
                : 'text-[#4a707a] hover:text-[#012f3d]'
            }`}
          >
            <span>Store &amp; EasyPaisa Settings</span>
          </button>
        </div>

        {/* TAB 1: ORDERS LIST WITH COMPLETE CUSTOMER ADDRESSES */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Bar & Quick Actions */}
            <div className="bg-white p-4 rounded-2xl border border-[#6ac8c1]/30 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#4a707a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by ID, customer, area, TRX..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#6ac8c1]/30 bg-[#faf8f2] text-[#012f3d] focus:ring-2 focus:ring-[#6ac8c1]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#6ac8c1]/30 bg-white text-[#012f3d] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="crafting">Crafting</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#6ac8c1]/30 bg-white text-[#012f3d] cursor-pointer"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="easypaisa">EasyPaisa Only</option>
                  <option value="cod">Cash on Delivery (COD) Only</option>
                </select>

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ type: 'clear-orders', count: orders.length })}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    title="Clear all orders in store database"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Clear All Orders</span>
                  </button>
                )}
              </div>
            </div>

            {/* Batch Action Toolbar for Selected Orders */}
            {selectedOrderIds.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-rose-950">
                    {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderIds([])}
                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-[#012f3d] hover:bg-rose-100/50 transition cursor-pointer"
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ type: 'multiple-orders', orderIds: selectedOrderIds })
                    }
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedOrderIds.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Orders Table with Address Display */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-[#6ac8c1]/30 text-[#4a707a] space-y-2">
                <Package className="w-12 h-12 mx-auto text-[#6ac8c1]" />
                <h4 className="font-serif text-lg font-bold text-[#012f3d]">No Orders Found</h4>
                <p className="text-xs text-[#2d5560]">
                  Try clearing search or filter terms to see customer orders.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#6ac8c1]/30 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#faf8f2] border-b border-[#f1ede1] text-[#012f3d] font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={allOrdersSelected}
                            onChange={toggleSelectAllOrders}
                            className="w-4 h-4 rounded text-[#012f3d] accent-[#012f3d] cursor-pointer"
                            title="Select / Deselect all"
                          />
                        </th>
                        <th className="py-3 px-4">Order ID &amp; Date</th>
                        <th className="py-3 px-4">Customer &amp; Contact</th>
                        <th className="py-3 px-4 min-w-[220px]">Delivery Address (Karachi)</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Payment &amp; TRX</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1ede1]">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className={`transition ${
                            selectedOrderIds.includes(order.id)
                              ? 'bg-rose-50/40'
                              : 'hover:bg-[#faf8f2]/60'
                          }`}
                        >
                          {/* Checkbox Column */}
                          <td className="py-3.5 px-3 text-center align-top">
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(order.id)}
                              onChange={() => toggleSelectOrder(order.id)}
                              className="w-4 h-4 rounded text-[#012f3d] accent-[#012f3d] cursor-pointer"
                            />
                          </td>
                          {/* Order ID & Date */}
                          <td className="py-3.5 px-4 align-top">
                            <span className="font-mono font-bold text-[#012f3d] block text-xs">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-[#4a707a] block mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString()} at{' '}
                              {new Date(order.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </td>

                          {/* Customer Name & WhatsApp Contact */}
                          <td className="py-3.5 px-4 align-top">
                            <strong className="text-[#012f3d] block text-xs">
                              {order.customer.fullName}
                            </strong>
                            <div className="flex items-center gap-1 text-[11px] text-[#2d5560] font-mono mt-0.5">
                              <Phone className="w-3 h-3 text-[#6ac8c1]" />
                              <span>{order.customer.phone}</span>
                            </div>
                            <button
                              onClick={() => handleWhatsAppCustomer(order)}
                              className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#012f3d] border border-[#25D366]/40 rounded-md text-[10px] font-bold transition cursor-pointer"
                              title="Click to WhatsApp this customer"
                            >
                              <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]" />
                              <span>WhatsApp</span>
                            </button>
                          </td>

                          {/* Customer Delivery Address (Requested: order kew address bh show ho) */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="space-y-1">
                              <div className="flex items-start gap-1 text-xs font-semibold text-[#012f3d]">
                                <MapPin className="w-3.5 h-3.5 text-[#6ac8c1] shrink-0 mt-0.5" />
                                <span className="leading-snug">{order.customer.address}</span>
                              </div>
                              {order.customer.karachiArea && (
                                <div className="pl-4.5">
                                  <span className="px-2 py-0.5 rounded-md bg-[#6ac8c1]/20 text-[#012f3d] text-[10px] font-bold">
                                    {order.customer.karachiArea}
                                  </span>
                                </div>
                              )}
                              <span className="text-[10px] text-[#4a707a] block pl-4.5">
                                City: {order.customer.city || 'Karachi'} {order.customer.postalCode ? `(${order.customer.postalCode})` : ''}
                              </span>
                              {order.customer.notes && (
                                <p className="text-[10px] text-[#2d5560] italic pl-4.5 line-clamp-2">
                                  "{order.customer.notes}"
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Items Preview */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-1.5 mb-1">
                              {order.items.slice(0, 3).map((item) => (
                                <img
                                  key={item.productId}
                                  src={item.image}
                                  alt={item.name}
                                  title={`${item.name} (Qty: ${item.quantity})`}
                                  className="w-8 h-8 rounded-lg object-cover border border-[#6ac8c1]/30"
                                />
                              ))}
                              {order.items.length > 3 && (
                                <span className="text-[10px] text-[#2d5560] font-semibold bg-[#faf8f2] px-1 py-0.5 rounded-sm">
                                  +{order.items.length - 3}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#2d5560] block">
                              {order.items.reduce((s, i) => s + i.quantity, 0)} items
                            </span>
                          </td>

                          {/* Payment & TRX */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                  order.paymentMethod === 'easypaisa'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'COD'}
                              </span>
                            </div>
                            {order.easyPaisaDetails?.transactionId && (
                              <span className="font-mono text-[10px] text-[#012f3d] block font-semibold">
                                TRX: {order.easyPaisaDetails.transactionId}
                              </span>
                            )}
                          </td>

                          {/* Total */}
                          <td className="py-3.5 px-4 align-top font-bold text-[#012f3d] font-sans text-xs sm:text-sm">
                            Rs. {order.total.toLocaleString()}
                          </td>

                          {/* Status and Quick Status Switcher */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex flex-col gap-1 items-start">
                              {getStatusBadge(order.status)}
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(order.id, e.target.value as OrderStatus)
                                }
                                className="text-[11px] bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-md px-1.5 py-0.5 text-[#012f3d] cursor-pointer mt-1"
                              >
                                <option value="pending_payment">Pending Payment</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="crafting">Crafting</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderForView(order)}
                                className="p-1.5 rounded-lg bg-[#faf8f2] hover:bg-[#6ac8c1]/20 text-[#012f3d] transition cursor-pointer border border-[#6ac8c1]/30"
                                title="View Order Details & Full Receipt"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrderConfirm(order)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-200/80 transition cursor-pointer"
                                title="Delete Order Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CROCHET CATALOG & INVENTORY MANAGER */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            {/* Header Bar with Add Button */}
            <div className="bg-white p-4 rounded-2xl border border-[#6ac8c1]/30 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#4a707a] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title, yarn..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#6ac8c1]/30 bg-[#faf8f2] text-[#012f3d]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#6ac8c1]/30 bg-white text-[#012f3d] cursor-pointer shrink-0"
                >
                  <option value="all">All Categories</option>
                  <option value="bags">Bags</option>
                  <option value="hats">Hats</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="keychains">Keychains</option>
                  <option value="handkerchiefs">Handkerchiefs</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition"
                >
                  <Plus className="w-4 h-4 text-[#6ac8c1]" />
                  <span>Add New Crochet Piece</span>
                </button>
              </div>
            </div>

            {/* Batch Action Toolbar for Selected Products */}
            {selectedProductIds.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-rose-950">
                    {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-[#012f3d] hover:bg-rose-100/50 transition cursor-pointer"
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ type: 'multiple-products', productIds: selectedProductIds })
                    }
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedProductIds.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border p-3.5 shadow-2xs hover:shadow-md transition flex flex-col justify-between relative ${
                    selectedProductIds.includes(prod.id)
                      ? 'border-rose-300 ring-2 ring-rose-200 bg-rose-50/20'
                      : 'border-[#6ac8c1]/30'
                  }`}
                >
                  <div>
                    <div className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden bg-[#faf8f2] mb-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Checkbox for multi-selection */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(prod.id)}
                          onChange={() => toggleSelectProduct(prod.id)}
                          className="w-4 h-4 rounded text-[#012f3d] accent-[#012f3d] cursor-pointer bg-white shadow-xs"
                          title="Select product"
                        />
                      </div>
                      <span className="absolute top-2 left-8 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-[#012f3d] uppercase shadow-2xs border border-[#6ac8c1]/30">
                        {prod.category}
                      </span>
                      {prod.isNewCollection && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#6ac8c1] text-[10px] font-bold text-[#012f3d] shadow-2xs">
                          In Carousel
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#012f3d] line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[#4a707a] line-clamp-1 mt-0.5">
                      {prod.yarnType}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f1ede1]">
                      <span className="font-bold text-sm text-[#012f3d]">
                        Rs. {prod.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#2d5560]">
                        Stock: <strong>{prod.stock}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-[#f1ede1]">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="px-3 py-1.5 bg-[#faf8f2] hover:bg-[#6ac8c1]/20 text-[#012f3d] border border-[#6ac8c1]/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProductConfirm(prod)}
                      className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-200/80 rounded-xl transition cursor-pointer"
                      title="Delete Product Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE & EASYPAISA SETTINGS */}
        {adminTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#6ac8c1]/30 shadow-sm max-w-2xl">
            <h3 className="font-serif text-2xl font-bold text-[#012f3d] mb-1">
              Store &amp; Payment Configuration (Karachi)
            </h3>
            <p className="text-xs text-[#2d5560] mb-6">
              Update EasyPaisa receiver account details, Karachi rider delivery fees, and WhatsApp support number.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                  EasyPaisa Account Title
                </label>
                <input
                  type="text"
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                  EasyPaisa Mobile Account Number
                </label>
                <input
                  type="text"
                  value={epNumber}
                  onChange={(e) => setEpNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Karachi Rider Shipping Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={stdShipping}
                    onChange={(e) => setStdShipping(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Free Delivery Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    WhatsApp Order Helpline
                  </label>
                  <input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                    Phone Call Support
                  </label>
                  <input
                    type="text"
                    value={phoneSupport}
                    onChange={(e) => setPhoneSupport(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#f1ede1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ type: 'reset-catalog' })}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Reset Catalog to Default
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        onDelete={(prodId) => {
          const prod = products.find((p) => p.id === prodId);
          if (prod) handleDeleteProductConfirm(prod);
        }}
        initialProduct={editingProduct}
      />

      <OrderDetailModal
        order={selectedOrderForView}
        onClose={() => setSelectedOrderForView(null)}
        onUpdateStatus={updateOrderStatus}
        onDeleteOrder={(orderId) => {
          const ord = orders.find((o) => o.id === orderId);
          if (ord) handleDeleteOrderConfirm(ord);
        }}
      />

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmationModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
};
