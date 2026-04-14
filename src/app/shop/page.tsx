import { API_ENDPOINTS } from "@/utils/constants";
import { Product } from "@/utils/types";
import ShopContent from "./ShopContent";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BACKEND_URL}${API_ENDPOINTS.PRODUCTS.URL}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopContent products={products} />;
}
