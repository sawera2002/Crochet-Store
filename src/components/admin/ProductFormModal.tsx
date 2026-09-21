import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, UploadCloud, Sparkles, Image as ImageIcon, Check, Trash2 } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  onDelete?: (productId: string) => void;
  initialProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialProduct
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'bags' | 'hats' | 'bracelets' | 'keychains' | 'handkerchiefs'>('bags');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(10);
  const [yarnType, setYarnType] = useState('100% Milk Cotton & Wool Yarn');
  const [dimensions, setDimensions] = useState('');
  const [craftTimeHours, setCraftTimeHours] = useState<number | ''>(4);
  const [colorsText, setColorsText] = useState('Cream, Sage Green, Pastel Pink');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewCollection, setIsNewCollection] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice || '');
      setStock(initialProduct.stock);
      setYarnType(initialProduct.yarnType || '');
      setDimensions(initialProduct.dimensions || '');
      setCraftTimeHours(initialProduct.craftTimeHours || '');
      setColorsText(initialProduct.colors?.join(', ') || '');
      setImage(initialProduct.image);
      setDescription(initialProduct.description);
      setIsFeatured(!!initialProduct.isFeatured);
      setIsNewCollection(initialProduct.isNewCollection ?? true);
    } else {
      setName('');
      setCategory('bags');
      setPrice('');
      setOriginalPrice('');
      setStock(10);
      setYarnType('100% Milk Cotton & Wool Yarn');
      setDimensions('');
      setCraftTimeHours(4);
      setColorsText('Cream, Sage, Pastel Peach');
      setImage('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80');
      setDescription('');
      setIsFeatured(true);
      setIsNewCollection(true);
    }
    setErrors({});
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const presetImages: { [key: string]: string[] } = {
    bags: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ],
    hats: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=900&q=80'
    ],
    bracelets: [
      'https://images.unsplash.com/photo-1611591475825-792942dd56e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80'
    ],
    keychains: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80'
    ],
    handkerchiefs: [
      'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80'
    ]
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Item title is required';
    if (!price || Number(price) <= 0) newErrors.price = 'Enter a valid price in PKR';
    if (!image.trim()) newErrors.image = 'Provide an image URL or upload photo';
    if (!description.trim()) newErrors.description = 'Provide a brief description of the stitches and design';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const colors = colorsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock) || 0,
      yarnType: yarnType.trim() || '100% Milk Cotton & Wool',
      dimensions: dimensions.trim() || undefined,
      craftTimeHours: craftTimeHours ? Number(craftTimeHours) : undefined,
      colors: colors.length > 0 ? colors : ['Pastel Cream'],
      image: image.trim(),
      description: description.trim(),
      isFeatured,
      isNewCollection
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012f3d]/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#6ac8c1]/40 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#f1ede1] flex items-center justify-between bg-[#faf8f2]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
              <span>Zarsal Karachi Studio</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#012f3d]">
              {initialProduct ? 'Edit Crochet Piece' : 'Add New Crochet Piece'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#2d5560] hover:text-[#012f3d] hover:bg-stone-200/60 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* New Collection Carousel Banner Notice */}
          <div className="p-3 bg-[#6ac8c1]/15 border border-[#6ac8c1]/40 rounded-2xl flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#012f3d] block">
                Feature in Home "New Collection" Carousel
              </span>
              <span className="text-[11px] text-[#2d5560]">
                When checked, this item will immediately show in the homepage carousel for Karachi shoppers.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isNewCollection}
                onChange={(e) => setIsNewCollection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#012f3d]" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Item Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pastel Daisy Scalloped Bucket Hat"
                className={`w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d] ${
                  errors.name ? 'border-rose-400' : 'border-[#6ac8c1]/30'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d] cursor-pointer"
              >
                <option value="bags">Bags &amp; Totes</option>
                <option value="hats">Hats &amp; Beanies</option>
                <option value="bracelets">Bracelets</option>
                <option value="keychains">Keychains &amp; Charms</option>
                <option value="handkerchiefs">Handkerchiefs</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Price (PKR) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="1850"
                className={`w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d] ${
                  errors.price ? 'border-rose-400' : 'border-[#6ac8c1]/30'
                }`}
              />
              {errors.price && <p className="text-[11px] text-rose-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Original Price (optional)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2100"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Units in Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="10"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
              />
            </div>
          </div>

          {/* Yarn, Dimensions, Craft Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Yarn / Thread Material
              </label>
              <input
                type="text"
                value={yarnType}
                onChange={(e) => setYarnType(e.target.value)}
                placeholder="e.g. 100% Milk Cotton"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Dimensions / Sizing
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. Fits 54-58cm head"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#012f3d] mb-1">
                Crafting Time (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={craftTimeHours}
                onChange={(e) => setCraftTimeHours(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="3.5"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
              />
            </div>
          </div>

          {/* Color Variations */}
          <div>
            <label className="block text-xs font-semibold text-[#012f3d] mb-1">
              Available Colors (comma-separated)
            </label>
            <input
              type="text"
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="Ivory Cream, Sage Green, Pastel Pink, Lavender"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl text-[#012f3d]"
            />
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#012f3d] mb-1">
              Product Image URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className={`flex-1 px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl text-[#012f3d] ${
                  errors.image ? 'border-rose-400' : 'border-[#6ac8c1]/30'
                }`}
              />
              <label className="px-3 py-2 bg-white border border-[#6ac8c1]/40 rounded-xl text-xs font-semibold text-[#012f3d] hover:bg-[#faf8f2] cursor-pointer flex items-center gap-1 shrink-0">
                <UploadCloud className="w-4 h-4 text-[#6ac8c1]" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && <p className="text-[11px] text-rose-600 mt-1">{errors.image}</p>}

            {/* Quick Preset Images */}
            {presetImages[category] && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-[#4a707a]">Quick presets:</span>
                {presetImages[category].map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(presetUrl)}
                    className="w-8 h-8 rounded-lg overflow-hidden border border-[#6ac8c1]/40 hover:border-[#012f3d] cursor-pointer"
                  >
                    <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#012f3d] mb-1">
              Description &amp; Stitch Details *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the stitches, texture, and how to wear or style this handmade piece..."
              className={`w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f2] border rounded-xl text-[#012f3d] ${
                errors.description ? 'border-rose-400' : 'border-[#6ac8c1]/30'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#012f3d] accent-[#012f3d]"
            />
            <label htmlFor="isFeatured" className="text-xs text-[#012f3d] font-semibold cursor-pointer">
              Mark as Bestseller / Featured Piece
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#f1ede1] flex items-center justify-between gap-2">
            <div>
              {initialProduct && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(initialProduct.id);
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#2d5560] hover:text-[#012f3d] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm active:scale-95"
              >
                {initialProduct ? 'Update Product' : 'Publish to Catalog'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
