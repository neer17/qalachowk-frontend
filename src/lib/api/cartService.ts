import { refreshSession } from "@/lib/api/common";
import { API_ENDPOINTS } from "@/utils/constants";

export interface CartApiItem {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  productSlug: string;
  productDescription: string;
  productMaterial: string;
  productPrice: number;
  productImages: { url: string; alt?: string; isMain: boolean }[];
  productCategory: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = process.env["NEXT_PUBLIC_BACKEND_BASE_URL"] ?? "";

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const response = await fetch(url, { ...options, credentials: "include" });

  if (response.status === 401) {
    const refreshed = await refreshSession();
    if (!refreshed) throw new Error("AUTH_REQUIRED");

    const retryResponse = await fetch(url, {
      ...options,
      credentials: "include",
    });
    if (!retryResponse.ok) {
      throw new Error(`Request failed: ${retryResponse.status}`);
    }
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const CartService = {
  getCart: (): Promise<{ data: CartApiItem[] }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.CART.URL}`, {
      method: API_ENDPOINTS.CART.METHOD,
      headers: { "Content-Type": "application/json" },
    }),

  addToCart: (
    productId: string,
    quantity = 1,
  ): Promise<{ data: CartApiItem }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.CART.URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    }),

  updateCartItem: (
    productId: string,
    quantity: number,
  ): Promise<{ data: CartApiItem }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.CART.URL}/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (
    productId: string,
  ): Promise<{ data: { success: boolean } }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.CART.URL}/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }),

  clearCart: (): Promise<{ data: { success: boolean } }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.CART.URL}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }),
};
