import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, StoreSettings, NavigationTab } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_ORDERS } from '../data/initialOrders';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  settings: StoreSettings;
  isAdmin: boolean;
  activeTab: NavigationTab;
  toast: Toast | null;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteMultipleProducts: (productIds: string[]) => void;
  resetProductsToDefault: () => void;
  // Cart actions
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  // Order actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteMultipleOrders: (orderIds: string[]) => void;
  clearAllOrders: () => void;
  // Admin auth
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  setActiveTab: (tab: NavigationTab) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  // Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Zarsal',
  tagline: 'Handmade Crochet Art | Karachi Studio',
  easyPaisaAccountTitle: 'Zarsal Studio (Sawera C.)',
  easyPaisaAccountNumber: '0304-7891234',
  freeShippingThreshold: 2500,
  standardShippingFee: 180,
  contactPhone: '+92 304 7891234',
  whatsappNumber: '03047891234',
  contactEmail: 'contact@zarsalcrochet.pk',
  cityServed: 'Karachi Only'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zarsal_products') || localStorage.getItem('stitch_petal_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Load orders from localStorage or default
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('zarsal_orders') || localStorage.getItem('stitch_petal_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zarsal_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Load store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('zarsal_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Admin auth state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zarsal_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [toast, setToast] = useState<Toast | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zarsal_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('zarsal_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('zarsal_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('zarsal_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('zarsal_is_admin', isAdmin ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isAdmin]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: color || product.colors?.[0] }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProdData.stock) || 1,
      isNewCollection: true,
      isFeatured: newProdData.isFeatured ?? true
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Item "${newProduct.name}" added to Zarsal New Collection!`);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const deleteMultipleProducts = (productIds: string[]) => {
    setProducts((prev) => prev.filter((p) => !productIds.includes(p.id)));
    showToast(`${productIds.length} product(s) deleted from catalog`, 'info');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    showToast('Reset catalog and orders to demo defaults', 'info');
  };

  // Order CRUD
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: orderData.paymentMethod === 'easypaisa' ? 'pending_payment' : 'confirmed',
      statusNotes:
        orderData.paymentMethod === 'easypaisa'
          ? 'EasyPaisa TRX submitted by customer. Awaiting shop verification.'
          : 'Cash on Delivery order booked. Ready for processing.'
    };

    // Decrement stock for ordered items
    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = orderData.items.find((it) => it.productId === prod.id);
        if (itemOrdered) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - itemOrdered.quantity)
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            statusNotes: note !== undefined ? note : order.statusNotes
          };
        }
        return order;
      })
    );
    showToast(`Order ${orderId} marked as "${status.replace('_', ' ')}"`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    showToast(`Order ${orderId} deleted`, 'info');
  };

  const deleteMultipleOrders = (orderIds: string[]) => {
    setOrders((prev) => prev.filter((order) => !orderIds.includes(order.id)));
    showToast(`${orderIds.length} order(s) deleted`, 'info');
  };

  const clearAllOrders = () => {
    setOrders([]);
    showToast('All orders cleared from admin records', 'info');
  };

  // Admin auth
  const loginAdmin = (passcode: string): boolean => {
    const normalized = passcode.trim().toLowerCase();
    // Default passcodes: admin, admin123, crochet2026
    if (normalized === 'admin' || normalized === 'admin123' || normalized === 'crochet2026') {
      setIsAdmin(true);
      setActiveTab('admin');
      showToast('Welcome to the Artisan Admin Studio', 'success');
      return true;
    }
    showToast('Invalid admin passcode. Try: crochet2026 or admin', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setActiveTab('home');
    showToast('Logged out of Admin Studio', 'info');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings updated');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        settings,
        isAdmin,
        activeTab,
        toast,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteMultipleProducts,
        resetProductsToDefault,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        deleteMultipleOrders,
        clearAllOrders,
        loginAdmin,
        logoutAdmin,
        setActiveTab,
        showToast,
        updateSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
