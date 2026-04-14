import { API_ENDPOINTS } from "@/utils/constants";
import { Product } from "@/utils/types";
import CategoryContent from "./CategoryContent";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}${API_ENDPOINTS.PRODUCTS_BY_CATEGORY.URL}/${category}`,
      {
        method: API_ENDPOINTS.PRODUCTS_BY_CATEGORY.METHOD,
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products = await getProductsByCategory(category);
  return <CategoryContent products={products} category={category} />;
}
