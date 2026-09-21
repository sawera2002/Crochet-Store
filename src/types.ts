export type ProductCategory = 'all' | 'bags' | 'hats' | 'bracelets' | 'keychains' | 'handkerchiefs';

export type NavigationTab = 'home' | 'about' | 'shop' | 'blogs' | 'contact' | 'admin';

export interface Product {
  id: string;
  name: string;
  category: 'bags' | 'hats' | 'bracelets' | 'keychains' | 'handkerchiefs';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  yarnType: string;
  dimensions?: string;
  colors?: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isNewCollection?: boolean;
  craftTimeHours?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'easypaisa' | 'cod';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'crafting'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  karachiArea?: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItemSummary {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  yarnType: string;
  selectedColor?: string;
}

export interface EasyPaisaDetails {
  senderMobileNumber?: string;
  transactionId?: string;
  paymentProofUrl?: string;
  senderName?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  easyPaisaDetails?: EasyPaisaDetails;
  status: OrderStatus;
  statusNotes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  easyPaisaAccountTitle: string;
  easyPaisaAccountNumber: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  cityServed: string;
}

export interface Review {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  purchasedItem: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content: string[];
}

