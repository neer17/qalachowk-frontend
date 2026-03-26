import { API_ENDPOINTS } from "@/utils/constants";
import { refreshSession } from "@/lib/api/common";

import type { components } from "@/types/api";
export type CreateOrderRequest = components["schemas"]["OrderInput"];
export type CreateOrderResponse = components["schemas"]["OrderResponse"];

export interface OrderAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone?: string;
  street?: string;
  landmark?: string;
}

export interface ProductImage {
  url: string;
}

export interface OrderItemProduct {
  id: string;
  name: string;
  images: ProductImage[];
}

export interface OrderItemDetail {
  id?: string;
  productId: string;
  quantity: number;
  price?: number;
  product?: OrderItemProduct;
}

export interface OrderDetail {
  id: string;
  userId: string;
  status: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  orderItems: OrderItemDetail[];
  paymentStatus: string;
  paymentMethod?: string;
  trackingNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getOrderInvoice(orderId: string): Promise<string> {
  const endpoint = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.ORDER_INVOICE.URL}/${orderId}/invoice`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshed = await refreshSession();
    if (!refreshed) throw new Error("Not authenticated");
    const retryResponse = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!retryResponse.ok) throw new Error("Request failed after refresh");
    const data = (await retryResponse.json()) as { invoiceUrl: string };
    return data.invoiceUrl;
  }

  if (!response.ok) throw new Error("Request failed");
  const data = (await response.json()) as { invoiceUrl: string };
  return data.invoiceUrl;
}

export const OrderService = {
  getOrder: async (orderId: string): Promise<{ data: OrderDetail }> => {
    const endpoint = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.ORDER_GET.URL}/${orderId}`;
    const response = await fetch(endpoint, {
      method: API_ENDPOINTS.ORDER_GET.METHOD,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (!refreshed) throw new Error("Not authenticated");
      const retryResponse = await fetch(endpoint, {
        method: API_ENDPOINTS.ORDER_GET.METHOD,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!retryResponse.ok) throw new Error("Request failed after refresh");
      return retryResponse.json();
    }

    if (!response.ok) throw new Error("Request failed");
    return response.json();
  },

  getUserOrders: async (userId: string): Promise<OrderDetail[]> => {
    const endpoint = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.ORDER_GET.URL}/user/${userId}`;
    const response = await fetch(endpoint, {
      method: API_ENDPOINTS.ORDER_GET.METHOD,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (!refreshed) throw new Error("Not authenticated");
      const retryResponse = await fetch(endpoint, {
        method: API_ENDPOINTS.ORDER_GET.METHOD,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!retryResponse.ok) throw new Error("Request failed after refresh");
      return retryResponse.json();
    }

    if (!response.ok) throw new Error("Request failed");
    return response.json();
  },

  createOrder: async (
    orderData: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    const ORDER_CREATE_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.ORDER_CREATE.URL}`;
    const createOrderRequest = fetch(ORDER_CREATE_ENDPOINT, {
      method: API_ENDPOINTS.ORDER_CREATE.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include",
    });
    const response = await createOrderRequest;

    if (response.status === 401) {
      const refreshed = await refreshSession();

      if (!refreshed) {
        throw new Error("Not authenticated");
      }

      // Retry original request once
      const retryResponse = await createOrderRequest;

      if (!retryResponse.ok) {
        throw new Error("Request failed after refresh");
      }

      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return response.json();
  },
};
