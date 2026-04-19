import { notFound } from "next/navigation";
import { API_ENDPOINTS } from "@/utils/constants";
import { Product } from "@/utils/types";
import ProductDetailContent from "./ProductDetailContent";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}${API_ENDPOINTS.PRODUCTS.URL}?slug=${slug}`,
      {
        method: API_ENDPOINTS.PRODUCTS.METHOD,
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

async function getSimilarProducts(collectionId: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}${API_ENDPOINTS.PRODUCTS.URL}?collectionId=${collectionId}`,
      {
        method: API_ENDPOINTS.PRODUCTS.METHOD,
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const { data } = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; productName: string }>;
}) {
  const { productName } = await params;
  const product = await getProductBySlug(productName);

  if (!product) {
    notFound();
  }

  const similarProducts = product.collectionId
    ? await getSimilarProducts(product.collectionId)
    : [];

  return (
    <ProductDetailContent product={product} similarProducts={similarProducts} />
  );
}
