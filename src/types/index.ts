// types/index.ts
import type { Decimal } from '@prisma/client/runtime/library';

// Custom Product type that handles Decimal properly
export interface ProductWithPricing {
  id: string;
  name: string;
  description: string;
  price: Decimal | number;
  salePrice?: Decimal | number | null;
  imageUrl: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  sku?: string | null;
  weight?: Decimal | number | null;
  slug: string;
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

// For API responses where Decimal is converted to number
export interface ProductAPIResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  sku?: string | null;
  weight?: number | null;
  slug: string;
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';