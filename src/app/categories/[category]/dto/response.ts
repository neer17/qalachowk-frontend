interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  mediumUrl?: string | null;
  largeUrl?: string | null;
  mimeType?: string | null;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  weight: number;
  material: string;
  images: ProductImage[];
  category: Category;
  specifications: Record<string, any>;
  isActive: boolean;
  allowBackOrder: boolean;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  careInstructions: string;
  isOnSale: boolean;
  salePrice: number;
  customizationOptions: Record<string, any>;
  metaTitle: string;
  metaDescription: string;
}
/* eslint-enable  @typescript-eslint/no-explicit-any */

export interface ApiResponse {
  data: Product[];
  message: string;
}
