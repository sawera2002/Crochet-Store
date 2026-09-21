import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ProductCategory, Product, CartItem, NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ShopPage } from './components/pages/ShopPage';
import { BlogsPage } from './components/pages/BlogsPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const StoreContent: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();

  const [shopCategory, setShopCategory] = useState<ProductCategory>('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);

  const handleInstantBuy = (product: Product, quantity: number, color?: string) => {
    setDirectBuyItem({ product, quantity, selectedColor: color });
    setIsCheckoutOpen(true);
  };

  const handleOpenCartCheckout = () => {
    setDirectBuyItem(null);
    setIsCheckoutOpen(true);
  };

  const handleNavigateToShop = (category: ProductCategory = 'all') => {
    setShopCategory(category);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] text-[#012f3d] flex flex-col font-sans selection:bg-[#6ac8c1]/30 selection:text-[#012f3d]">
      {/* Complete Responsive Navbar with Home, About, Shop, Blogs, Contact */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={(tab: NavigationTab) => setActiveTab(tab)}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onOpenProductDetails={(p) => setSelectedProductDetails(p)}
            onNavigateToShop={handleNavigateToShop}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'shop' && (
          <ShopPage
            initialCategory={shopCategory}
            onOpenProductDetails={(p) => setSelectedProductDetails(p)}
          />
        )}

        {activeTab === 'blogs' && <BlogsPage />}

        {activeTab === 'contact' && <ContactPage />}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onInstantBuy={handleInstantBuy}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={handleOpenCartCheckout}
      />

      {/* Easy Checkout Modal (Karachi Delivery, Address, EasyPaisa & COD) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
        }}
        directBuyItem={directBuyItem}
      />

      {/* Persistent Floating WhatsApp Contact Button */}
      <WhatsAppButton />

      {/* Interactive System Toast Feedback */}
      <Toast />

      {/* Site Footer with Crochet Art, Links, & Helpline */}
      <Footer
        onSelectCategory={(cat) => {
          handleNavigateToShop(cat);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
