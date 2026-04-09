import { API_ENDPOINTS } from "@/utils/constants";
import type { BundleOffer, MerchandisingProduct, Product } from "@/utils/types";

const BASE_URL = process.env["NEXT_PUBLIC_BACKEND_BASE_URL"] ?? "";

export interface CartRecommendationsResponse {
  recommendations: MerchandisingProduct[];
  bundlePreview?: BundleOffer;
  thresholdMessage?: string;
}

export const ProductService = {
  getProductsBySlug: async (slug: string): Promise<Product[]> => {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}?slug=${slug}`,
      {
        method: API_ENDPOINTS.PRODUCTS.METHOD,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const payload = (await response.json()) as { data?: Product[] };
    return payload.data ?? [];
  },

  getProductsByCollection: async (collectionId: string): Promise<Product[]> => {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}?collectionId=${collectionId}`,
      {
        method: API_ENDPOINTS.PRODUCTS.METHOD,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch collection products");
    }

    const payload = (await response.json()) as { data?: Product[] };
    return payload.data ?? [];
  },

  getCartRecommendations: async (
    productIds: string[],
  ): Promise<CartRecommendationsResponse> => {
    if (productIds.length === 0) {
      return { recommendations: [] };
    }

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.PRODUCT_CART_RECOMMENDATIONS.URL}`,
      {
        method: API_ENDPOINTS.PRODUCT_CART_RECOMMENDATIONS.METHOD,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cart recommendations");
    }

    const payload = (await response.json()) as {
      data?: CartRecommendationsResponse;
    };

    return payload.data ?? { recommendations: [] };
  },
};
