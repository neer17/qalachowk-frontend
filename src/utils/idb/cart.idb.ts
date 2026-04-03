import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { Product } from "@/utils/types";

interface CartItemWithMeta extends Product {
  savedAt: number;
}

interface CartIDB extends DBSchema {
  cartStore: {
    key: string;
    value: CartItemWithMeta;
  };
}

const DB_NAME = "CartDB_v2"; // separate from legacy cartDB to avoid schema conflicts
const DB_VERSION = 1;
const STORE_NAME = "cartStore";
const CART_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

let dbInstance: IDBPDatabase<CartIDB> | null = null;

async function getDB(): Promise<IDBPDatabase<CartIDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<CartIDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
  return dbInstance;
}

/** Load all cart items, pruning any that have exceeded the 30-day TTL. */
export async function loadCartItems(): Promise<Map<string, Product>> {
  try {
    const db = await getDB();
    const all = await db.getAll(STORE_NAME);
    const now = Date.now();
    const map = new Map<string, Product>();
    for (const item of all) {
      if (now - item.savedAt < CART_TTL_MS) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { savedAt, ...product } = item;
        map.set(product.id, product as Product);
      } else {
        // Item has expired — prune silently
        await db.delete(STORE_NAME, item.id);
      }
    }
    return map;
  } catch (error) {
    console.error("Failed to load cart from IDB:", error);
    return new Map();
  }
}

/** Persist a cart item, stamping it with the current time for TTL tracking. */
export async function saveCartItem(item: Product): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, { ...item, savedAt: Date.now() });
  } catch (error) {
    console.error("Failed to save cart item to IDB:", error);
  }
}

/** Remove a single cart item by id. */
export async function deleteCartItem(itemId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, itemId);
  } catch (error) {
    console.error("Failed to delete cart item from IDB:", error);
  }
}

/** Clear the entire cart store. */
export async function clearCartIDB(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
  } catch (error) {
    console.error("Failed to clear cart IDB:", error);
  }
}
