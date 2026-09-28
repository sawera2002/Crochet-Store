import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, StoreSettings, NavigationTab } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import {
  fetchProductsFromDb,
  insertProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  deleteMultipleProductsFromDb,
  fetchOrdersFromDb,
  insertOrderToDb,
  updateOrderStatusInDb,
  deleteOrderFromDb,
  deleteMultipleOrdersFromDb,
  clearAllOrdersFromDb,
  checkSupabaseConnection,
  SUPABASE_SETUP_SQL
} from '../lib/db';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface SupabaseStatus {
  connected: boolean;
  productsTableExists: boolean;
  ordersTableExists: boolean;
  message: string;
  checking: boolean;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  settings: StoreSettings;
  isAdmin: boolean;
  activeTab: NavigationTab;
  toast: Toast | null;
  isLoadingDb: boolean;
  supabaseStatus: SupabaseStatus;
  refreshDbData: () => Promise<void>;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => Promise<void>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteMultipleProducts: (productIds: string[]) => Promise<void>;
  resetProductsToDefault: () => void;
  seedSampleCatalog: () => Promise<void>;
  clearAllProducts: () => Promise<void>;
  // Cart actions
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  // Order actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteMultipleOrders: (orderIds: string[]) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  // Admin auth
  loginAdmin: (username: string, passcode: string) => boolean;
  logoutAdmin: () => void;
  setActiveTab: (tab: NavigationTab) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  // Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  supabaseSql: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Zarsal',
  tagline: 'Handmade Crochet Art | Karachi Studio',
  easyPaisaAccountTitle: 'Zarsal Studio (Sawera C.)',
  easyPaisaAccountNumber: '0324336202',
  freeShippingThreshold: 2500,
  standardShippingFee: 180,
  contactPhone: '+92 324 336202',
  whatsappNumber: '0324336202',
  contactEmail: 'contact@zarsalcrochet.pk',
  cityServed: 'Karachi Only'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purely dynamic / admin-managed products: starts empty or from localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zarsal_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Orders: starts empty or from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('zarsal_admin_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zarsal_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('zarsal_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === '03047891234' || !parsed.whatsappNumber) {
          parsed.whatsappNumber = '0324336202';
        }
        if (parsed.contactPhone === '+92 304 7891234' || !parsed.contactPhone) {
          parsed.contactPhone = '+92 324 336202';
        }
        if (parsed.easyPaisaAccountNumber === '0304-7891234') {
          parsed.easyPaisaAccountNumber = '0324336202';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
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

  // Navigation tab with URL sync
  const getInitialTab = (): NavigationTab => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith('/admin') || hash.startsWith('#admin') || hash.startsWith('#/admin')) {
      return 'admin';
    }
    if (path.startsWith('/shop') || hash.startsWith('#shop')) return 'shop';
    if (path.startsWith('/about') || hash.startsWith('#about')) return 'about';
    if (path.startsWith('/blogs') || hash.startsWith('#blogs')) return 'blogs';
    if (path.startsWith('/contact') || hash.startsWith('#contact')) return 'contact';
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<NavigationTab>(getInitialTab);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>({
    connected: false,
    productsTableExists: false,
    ordersTableExists: false,
    message: 'Connecting to Supabase...',
    checking: true
  });

  // URL pushState sync
  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'home' ? '/' : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({ tab }, '', targetPath);
        } catch {
          window.location.hash = tab === 'home' ? '' : `#${tab}`;
        }
      }
    }
  };

  // Listen to popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash.startsWith('#admin') || hash.startsWith('#/admin')) {
        setActiveTabState('admin');
      } else if (path.startsWith('/shop') || hash.startsWith('#shop')) {
        setActiveTabState('shop');
      } else if (path.startsWith('/about') || hash.startsWith('#about')) {
        setActiveTabState('about');
      } else if (path.startsWith('/blogs') || hash.startsWith('#blogs')) {
        setActiveTabState('blogs');
      } else if (path.startsWith('/contact') || hash.startsWith('#contact')) {
        setActiveTabState('contact');
      } else if (path === '/' || path === '') {
        setActiveTabState('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zarsal_admin_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('zarsal_admin_orders', JSON.stringify(orders));
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

  // Load from Supabase on mount
  const refreshDbData = async () => {
    setIsLoadingDb(true);
    setSupabaseStatus((prev) => ({ ...prev, checking: true }));

    try {
      const health = await checkSupabaseConnection();
      setSupabaseStatus({
        connected: health.connected,
        productsTableExists: health.productsTableExists,
        ordersTableExists: health.ordersTableExists,
        message: health.message,
        checking: false
      });

      if (health.productsTableExists) {
        const prodResult = await fetchProductsFromDb();
        if (prodResult.products !== null) {
          setProducts(prodResult.products);
        }
      }

      if (health.ordersTableExists) {
        const orderResult = await fetchOrdersFromDb();
        if (orderResult.orders !== null) {
          setOrders(orderResult.orders);
        }
      }
    } catch (e: any) {
      console.warn('Supabase initial fetch error:', e);
      setSupabaseStatus({
        connected: false,
        productsTableExists: false,
        ordersTableExists: false,
        message: e?.message || 'Failed to connect to Supabase',
        checking: false
      });
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    refreshDbData();
  }, []);

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
  const addProduct = async (newProdData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProdData.stock) || 1,
      isNewCollection: newProdData.isNewCollection ?? true,
      isFeatured: newProdData.isFeatured ?? true
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Item "${newProduct.name}" added to catalog!`);

    const res = await insertProductToDb(newProduct);
    if (!res.success && res.error) {
      console.warn('Product saved locally. Supabase table update pending:', res.error);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Product updated successfully');
    await updateProductInDb(id, updatedFields);
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
    await deleteProductFromDb(id);
  };

  const deleteMultipleProducts = async (productIds: string[]) => {
    setProducts((prev) => prev.filter((p) => !productIds.includes(p.id)));
    showToast(`${productIds.length} product(s) deleted from catalog`, 'info');
    await deleteMultipleProductsFromDb(productIds);
  };

  const clearAllProducts = async () => {
    const ids = products.map((p) => p.id);
    setProducts([]);
    showToast('All products removed from catalog', 'info');
    if (ids.length > 0) {
      await deleteMultipleProductsFromDb(ids);
    }
  };

  const seedSampleCatalog = async () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Loaded sample crochet catalog items', 'info');
    // Attempt saving to Supabase if tables exist
    for (const prod of INITIAL_PRODUCTS) {
      await insertProductToDb(prod);
    }
  };

  const resetProductsToDefault = () => {
    setProducts([]);
    setOrders([]);
    showToast('Catalog cleared. Add products via Admin Panel.', 'info');
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
          : 'Cash on Delivery order booked. Ready for Karachi dispatch.'
    };

    // Decrement stock for ordered items
    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = orderData.items.find((it) => it.productId === prod.id);
        if (itemOrdered) {
          const newStock = Math.max(0, prod.stock - itemOrdered.quantity);
          updateProductInDb(prod.id, { stock: newStock });
          return {
            ...prod,
            stock: newStock
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to Supabase asynchronously
    insertOrderToDb(newOrder).catch((err) => {
      console.warn('Order saved locally. Supabase insert note:', err);
    });

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
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
    await updateOrderStatusInDb(orderId, status, note);
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    showToast(`Order ${orderId} deleted`, 'info');
    await deleteOrderFromDb(orderId);
  };

  const deleteMultipleOrders = async (orderIds: string[]) => {
    setOrders((prev) => prev.filter((order) => !orderIds.includes(order.id)));
    showToast(`${orderIds.length} order(s) deleted`, 'info');
    await deleteMultipleOrdersFromDb(orderIds);
  };

  const clearAllOrders = async () => {
    setOrders([]);
    showToast('All orders cleared from records', 'info');
    await clearAllOrdersFromDb();
  };

  // Admin auth - STRICT: username 'admin', password 'admin@321', NEVER displayed
  const loginAdmin = (username: string, passcode: string): boolean => {
    const validUsername = username.trim().toLowerCase() === 'admin';
    const validPassword = passcode.trim() === 'admin@321';

    if (validUsername && validPassword) {
      setIsAdmin(true);
      setActiveTab('admin');
      showToast('Welcome to Zarsal Admin Studio', 'success');
      return true;
    }
    showToast('Invalid username or password', 'error');
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
        isLoadingDb,
        supabaseStatus,
        refreshDbData,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteMultipleProducts,
        resetProductsToDefault,
        seedSampleCatalog,
        clearAllProducts,
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
        updateSettings,
        supabaseSql: SUPABASE_SETUP_SQL
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
