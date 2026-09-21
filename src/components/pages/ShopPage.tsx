import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';

interface ShopPageProps {
  initialCategory?: ProductCategory;
  onOpenProductDetails: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  onOpenProductDetails
}) => {
  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categoryTabs: { id: ProductCategory; label: string; icon: string; count?: number }[] = [
    { id: 'all', label: 'All Handmade', icon: '✨' },
    { id: 'bags', label: 'Bags & Totes', icon: '👜' },
    { id: 'keychains', label: 'Keychains & Charms', icon: '🍓' },
    { id: 'hats', label: 'Daisy Hats & Beanies', icon: '👒' },
    { id: 'bracelets', label: 'Friendship Bracelets', icon: '🌸' },
    { id: 'handkerchiefs', label: 'Lace Handkerchiefs', icon: '🪡' }
  ];

  // Filter & sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const matchesCategory =
          selectedCategory === 'all' || prod.category === selectedCategory;
        const matchesSearch =
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.yarnType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = inStockOnly ? prod.stock > 0 : true;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="bg-[#faf8f2] text-[#012f3d] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Karachi Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#6ac8c1]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <span>All Handmade Crochet Items • 100% Milk Cotton</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#012f3d] tracking-tight">
              Zarsal Artisan Shop
            </h1>
            <p className="text-[#2d5560] text-xs sm:text-sm mt-1.5 max-w-xl">
              Browse our complete catalog of hand-knitted bags, keychains, bucket hats, bracelets, and handkerchiefs.
              Direct delivery across Karachi with Cash on Delivery &amp; EasyPaisa.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#012f3d] bg-white px-3.5 py-2 rounded-xl border border-[#6ac8c1]/30">
            <MapPin className="w-4 h-4 text-[#6ac8c1]" />
            <span>Karachi Delivery Only • Rider 2-3 Days</span>
          </div>
        </div>

        {/* Category Tabs (Requested: tabs like bags, keychain wagera) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 mb-6">
          {categoryTabs.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const count =
              tab.id === 'all'
                ? products.length
                : products.filter((p) => p.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#012f3d] text-[#faf8f2] border-[#012f3d] shadow-sm scale-102'
                    : 'bg-white text-[#012f3d] border-[#6ac8c1]/30 hover:border-[#012f3d] hover:bg-[#fbf9f4]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-[#6ac8c1] text-[#012f3d] font-bold'
                      : 'bg-[#faf8f2] text-[#2d5560]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar: Search, In Stock, Sorting */}
        <div className="bg-white rounded-2xl p-4 border border-[#6ac8c1]/30 shadow-2xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#4a707a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, wool type, keychain, bag..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a707a] hover:text-[#012f3d] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: In-Stock and Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#012f3d] cursor-pointer select-none bg-[#faf8f2] px-3.5 py-2 rounded-xl border border-[#6ac8c1]/30">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#012f3d] accent-[#012f3d]"
              />
              <span>Ready in Stock</span>
            </label>

            <div className="flex items-center gap-1.5 bg-[#faf8f2] px-3 py-1.5 rounded-xl border border-[#6ac8c1]/30 text-xs text-[#012f3d]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#012f3d] font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-[#2d5560] font-medium">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-white border border-[#6ac8c1]/40 rounded-lg text-xs font-semibold text-[#012f3d] flex items-center gap-1.5 shadow-2xs">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[#4a707a] hover:text-[#012f3d]"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-white border border-[#6ac8c1]/40 rounded-lg text-xs font-semibold text-[#012f3d] flex items-center gap-1.5 shadow-2xs">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#4a707a] hover:text-[#012f3d]"
                >
                  ×
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="px-3 py-1 bg-white border border-[#6ac8c1]/40 rounded-lg text-xs font-semibold text-[#012f3d] flex items-center gap-1.5 shadow-2xs">
                Ready to Ship Only
                <button
                  onClick={() => setInStockOnly(false)}
                  className="text-[#4a707a] hover:text-[#012f3d]"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="text-xs text-[#012f3d] hover:text-[#024357] underline ml-2 cursor-pointer font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-[#6ac8c1]/40 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#faf8f2] border border-[#6ac8c1]/30 flex items-center justify-center text-3xl mx-auto shadow-2xs">
              🧶
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#012f3d]">
              No Matching Crochet Pieces Found
            </h3>
            <p className="text-[#2d5560] text-xs sm:text-sm max-w-md mx-auto">
              We couldn't find items matching your search. Try changing the category tab or clear your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-6 py-2.5 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Show All Handmade Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
