interface Category {
  description: string;
  id: string;
  name: string;
  slug: string;
}

export interface MerchandisingProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: ProductImage[];
  category: Category;
  discountedPrice?: number;
  bundleDiscountPct?: number;
}

export interface UpgradeOption extends MerchandisingProduct {
  badgeText: string;
  priceDelta: number;
}

export interface BundleOffer {
  id: string;
  name: string;
  badgeText: string;
  headline: string;
  subheadline: string;
  productIds: string[];
  products: MerchandisingProduct[];
  discountAmount: number;
  finalAmount: number;
}

export interface ProductMerchandising {
  completeTheLook: MerchandisingProduct[];
  bundleOffers: BundleOffer[];
  upgradeOption?: UpgradeOption;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  material?: string;
  images: ProductImage[];
  price: number;
  originalPrice?: number;
  quantity: number;
  category: Category;
  imageSizes?: string;
  slug: string;
  collectionId?: string;
  merchandising?: ProductMerchandising;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder?: number;
}
