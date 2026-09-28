import { supabase } from './supabase';
import { Product, Order, OrderStatus } from '../types';

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:
-- Project: https://ogfapocufuxzrvpckpfc.supabase.co

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    "originalPrice" NUMERIC,
    image TEXT NOT NULL,
    description TEXT,
    "yarnType" TEXT,
    dimensions TEXT,
    colors JSONB DEFAULT '[]'::jsonb,
    stock INTEGER DEFAULT 1,
    rating NUMERIC DEFAULT 5.0,
    "reviewsCount" INTEGER DEFAULT 1,
    "isFeatured" BOOLEAN DEFAULT true,
    "isNewCollection" BOOLEAN DEFAULT true,
    "craftTimeHours" INTEGER DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    "shippingFee" NUMERIC NOT NULL DEFAULT 180,
    total NUMERIC NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "easyPaisaDetails" JSONB,
    status TEXT NOT NULL DEFAULT 'confirmed',
    "statusNotes" TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Allow full public access for this boutique store)
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
CREATE POLICY "Allow public read on products" 
ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow full access on products" ON public.products;
CREATE POLICY "Allow full access on products" 
ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access on orders" ON public.orders;
CREATE POLICY "Allow full access on orders" 
ON public.orders FOR ALL USING (true) WITH CHECK (true);
`;

const isTableNotFoundError = (err: any): boolean => {
  if (!err) return false;
  const msg = err.message || '';
  const code = err.code || '';
  return code === 'PGRST205' || code === '42P01' || msg.includes('does not exist') || msg.includes('Could not find the table');
};

export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  productsTableExists: boolean;
  ordersTableExists: boolean;
  message: string;
}> => {
  try {
    const [pRes, oRes] = await Promise.all([
      supabase.from('products').select('id').limit(1),
      supabase.from('orders').select('id').limit(1)
    ]);

    const pMissing = isTableNotFoundError(pRes.error);
    const oMissing = isTableNotFoundError(oRes.error);

    return {
      connected: !pMissing || !oMissing || (!pRes.error && !oRes.error),
      productsTableExists: !pRes.error,
      ordersTableExists: !oRes.error,
      message: (!pRes.error && !oRes.error)
        ? 'Connected to Supabase. Both products and orders tables are active.'
        : 'Connected to Supabase endpoint, but SQL tables need to be created in Supabase SQL editor.'
    };
  } catch (err: any) {
    return {
      connected: false,
      productsTableExists: false,
      ordersTableExists: false,
      message: err?.message || 'Connection failed'
    };
  }
};

export const fetchProductsFromDb = async (): Promise<{
  products: Product[] | null;
  tableMissing: boolean;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { products: null, tableMissing: isTableNotFoundError(error), error };
    }

    const mapped: Product[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
      image: row.image,
      description: row.description || '',
      yarnType: row.yarnType || '',
      dimensions: row.dimensions || undefined,
      colors: Array.isArray(row.colors) ? row.colors : [],
      stock: Number(row.stock ?? 1),
      rating: Number(row.rating ?? 5),
      reviewsCount: Number(row.reviewsCount ?? 1),
      isFeatured: Boolean(row.isFeatured),
      isNewCollection: Boolean(row.isNewCollection),
      craftTimeHours: row.craftTimeHours ? Number(row.craftTimeHours) : undefined
    }));

    return { products: mapped, tableMissing: false, error: null };
  } catch (err: any) {
    return { products: null, tableMissing: isTableNotFoundError(err), error: err };
  }
};

export const insertProductToDb = async (product: Product): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('products').insert([
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        image: product.image,
        description: product.description,
        yarnType: product.yarnType,
        dimensions: product.dimensions ?? null,
        colors: product.colors ?? [],
        stock: product.stock,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        isFeatured: product.isFeatured ?? true,
        isNewCollection: product.isNewCollection ?? true,
        craftTimeHours: product.craftTimeHours ?? null
      }
    ]);
    if (error) {
      console.warn('Supabase insert product warning:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (err) {
    console.warn('Supabase insert error:', err);
    return { success: false, error: err };
  }
};

export const updateProductInDb = async (id: string, updates: Partial<Product>): Promise<{ success: boolean; error: any }> => {
  try {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.originalPrice !== undefined) payload.originalPrice = updates.originalPrice;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.yarnType !== undefined) payload.yarnType = updates.yarnType;
    if (updates.dimensions !== undefined) payload.dimensions = updates.dimensions;
    if (updates.colors !== undefined) payload.colors = updates.colors;
    if (updates.stock !== undefined) payload.stock = updates.stock;
    if (updates.rating !== undefined) payload.rating = updates.rating;
    if (updates.reviewsCount !== undefined) payload.reviewsCount = updates.reviewsCount;
    if (updates.isFeatured !== undefined) payload.isFeatured = updates.isFeatured;
    if (updates.isNewCollection !== undefined) payload.isNewCollection = updates.isNewCollection;
    if (updates.craftTimeHours !== undefined) payload.craftTimeHours = updates.craftTimeHours;

    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const deleteProductFromDb = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const deleteMultipleProductsFromDb = async (ids: string[]): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('products').delete().in('id', ids);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const fetchOrdersFromDb = async (): Promise<{
  orders: Order[] | null;
  tableMissing: boolean;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { orders: null, tableMissing: isTableNotFoundError(error), error };
    }

    const mapped: Order[] = (data || []).map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
      customer: row.customer,
      items: row.items,
      subtotal: Number(row.subtotal),
      shippingFee: Number(row.shippingFee ?? 180),
      total: Number(row.total),
      paymentMethod: row.paymentMethod,
      easyPaisaDetails: row.easyPaisaDetails || undefined,
      status: row.status as OrderStatus,
      statusNotes: row.statusNotes || undefined
    }));

    return { orders: mapped, tableMissing: false, error: null };
  } catch (err: any) {
    return { orders: null, tableMissing: isTableNotFoundError(err), error: err };
  }
};

export const insertOrderToDb = async (order: Order): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('orders').insert([
      {
        id: order.id,
        created_at: order.createdAt,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        easyPaisaDetails: order.easyPaisaDetails ?? null,
        status: order.status,
        statusNotes: order.statusNotes ?? null
      }
    ]);
    if (error) {
      console.warn('Supabase insert order warning:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (err) {
    console.warn('Supabase order insert error:', err);
    return { success: false, error: err };
  }
};

export const updateOrderStatusInDb = async (
  id: string,
  status: OrderStatus,
  notes?: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const payload: any = { status };
    if (notes !== undefined) payload.statusNotes = notes;
    const { error } = await supabase.from('orders').update(payload).eq('id', id);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const deleteOrderFromDb = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const deleteMultipleOrdersFromDb = async (ids: string[]): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('orders').delete().in('id', ids);
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const clearAllOrdersFromDb = async (): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.from('orders').delete().neq('id', '___non_existent___');
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};
