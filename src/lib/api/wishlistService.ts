import { API_ENDPOINTS } from "@/utils/constants";
import { refreshSession } from "@/lib/api/common";

export interface WishlistApiItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImages: { url: string; alt?: string; isMain: boolean }[];
  createdAt: string;
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
    if (!retryResponse.ok) throw new Error("Request failed after refresh");
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const WishlistService = {
  getWishlist: (): Promise<{ data: WishlistApiItem[] }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.WISHLIST_GET.URL}`, {
      method: API_ENDPOINTS.WISHLIST_GET.METHOD,
      headers: { "Content-Type": "application/json" },
    }),

  addToWishlist: (productId: string): Promise<{ data: WishlistApiItem }> =>
    fetchWithRetry(`${BASE_URL}${API_ENDPOINTS.WISHLIST_ADD.URL}`, {
      method: API_ENDPOINTS.WISHLIST_ADD.METHOD,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }),

  removeFromWishlist: (
    productId: string,
  ): Promise<{ data: { success: boolean } }> =>
    fetchWithRetry(
      `${BASE_URL}${API_ENDPOINTS.WISHLIST_REMOVE.URL}/${productId}`,
      {
        method: API_ENDPOINTS.WISHLIST_REMOVE.METHOD,
        headers: { "Content-Type": "application/json" },
      },
    ),
};
