import { API_ENDPOINTS } from "@/utils/constants";
import { refreshSession } from "@/lib/api/common";

import type { components } from "@/types/api";
export type CreateOrderRequest = components["schemas"]["OrderInput"];
export type CreateOrderResponse = components["schemas"]["OrderResponse"];
export type CreateRazorpayOrderRequest = Omit<
  CreateOrderRequest,
  "paymentId" | "paymentStatus" | "paymentMethod"
>;

export interface RazorpayCreateOrderResponse {
  paymentAttemptId: string;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: "INR";
  prefill: {
    name: string;
    email?: string;
    contact?: string;
  };
  // Dev-only. When true, the backend has overridden `amount` to a small
  // smoke-test value to validate live Razorpay keys without spending real
  // money. Frontend should warn the user before opening Checkout.
  liveSmokeTestActive?: boolean;
}

export interface RazorpayVerifyPaymentRequest {
  paymentAttemptId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerifyPaymentResponse {
  orderId: string;
  orderNumber?: string;
}

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
  thumbnailUrl?: string | null;
  mediumUrl?: string | null;
  largeUrl?: string | null;
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
  orderNumber?: string;
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

  createRazorpayOrder: async (
    orderData: CreateRazorpayOrderRequest,
    idempotencyKey: string,
  ): Promise<RazorpayCreateOrderResponse> => {
    const endpoint = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.RAZORPAY_CREATE_ORDER.URL}`;
    const request = () =>
      fetch(endpoint, {
        method: API_ENDPOINTS.RAZORPAY_CREATE_ORDER.METHOD,
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(orderData),
        credentials: "include",
      });

    let response = await request();
    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (!refreshed) throw new Error("Not authenticated");
      response = await request();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Unable to create payment order");
    }

    return response.json();
  },

  verifyRazorpayPayment: async (
    paymentData: RazorpayVerifyPaymentRequest,
  ): Promise<RazorpayVerifyPaymentResponse> => {
    const endpoint = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.RAZORPAY_VERIFY.URL}`;
    const request = () =>
      fetch(endpoint, {
        method: API_ENDPOINTS.RAZORPAY_VERIFY.METHOD,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
        credentials: "include",
      });

    let response = await request();
    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (!refreshed) throw new Error("Not authenticated");
      response = await request();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Unable to verify payment");
    }

    return response.json();
  },

  // Fire-and-forget. Called when the user dismisses the Razorpay modal so the
  // backend can release the held stock immediately instead of waiting for the
  // 15-min reservation TTL. Network failures are swallowed — the stock-TTL cron
  // is the safety net.
  abandonRazorpayPayment: (paymentAttemptId: string): void => {
    const endpoint = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.RAZORPAY_ABANDON.URL}`;
    fetch(endpoint, {
      method: API_ENDPOINTS.RAZORPAY_ABANDON.METHOD,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentAttemptId }),
      credentials: "include",
      keepalive: true,
    }).catch(() => {
      /* fire-and-forget */
    });
  },
};
