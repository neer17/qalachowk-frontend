import { API_ENDPOINTS } from "@/utils/constants";
import { Product } from "@/utils/types";
import CategoryContent from "../../categories/[category]/CategoryContent";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

async function getProductsByCollection(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}${API_ENDPOINTS.COLLECTION_PRODUCTS_BY_SLUG.URL}/${slug}/products`,
      {
        method: API_ENDPOINTS.COLLECTION_PRODUCTS_BY_SLUG.METHOD,
        headers: { "Content-Type": "application/json" },
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCollection(slug);
  return <CategoryContent products={products} category={slug} />;
}
