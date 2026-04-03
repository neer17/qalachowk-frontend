"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { openDB, DBSchema, IDBPDatabase } from "idb";

import { Product } from "@/utils/types";
import {
  WishlistService,
  type WishlistApiItem,
} from "@/lib/api/wishlistService";

// Props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cartData: Map<string, Product>;
  setCartData: (cartObject: Product) => Promise<void>;
  removeCartData: (itemId: string) => Promise<void>;
  deleteCartData: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

// Context type for Wishlist
interface WishlistContextType {
  wishlistData: Map<string, Product>;
  addWishlistItem: (wishlistObject: Product) => Promise<void>;
  removeWishlistItem: (itemId: string) => Promise<void>;
  isLoading: boolean;
}

// Define the database schema
interface CartDB extends DBSchema {
  cartStore: {
    key: string;
    value: Product;
  };
  wishlistStore: {
    key: string;
    value: Product;
  };
}

// Create context with proper type and default value
const CartContext = createContext<CartContextType | undefined>(undefined);
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

// Map API wishlist item to the local Product shape used in IndexedDB / state
function apiItemToProduct(item: WishlistApiItem): Product {
  return {
    id: item.productId,
    name: item.productName,
    price: item.productPrice,
    images: item.productImages.map((img, index) => ({
      id: `${item.productId}-img-${index}`,
      url: img.url,
      alt: img.alt ?? item.productName,
      isMain: img.isMain,
      sortOrder: index,
    })),
    description: "",
    material: "",
    quantity: 1,
    category: { id: "", name: "", slug: "", description: "" },
    slug: "",
  };
}

// Initialize IndexedDB only if in the browser
let dbPromise: Promise<IDBPDatabase<CartDB>> | undefined;
if (typeof window !== "undefined") {
  dbPromise = openDB<CartDB>("cartDB", 1, {
    upgrade(db) {
      db.createObjectStore("cartStore", { keyPath: "id" });
      db.createObjectStore("wishlistStore", { keyPath: "id" });
    },
  });
}

export default function CartProvider({ children }: CartProviderProps) {
  const [cartData, setCartDataState] = useState<Map<string, Product>>(
    new Map(),
  );
  const [wishlistData, setWishlistDataState] = useState<Map<string, Product>>(
    new Map(),
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  // Tracks whether the current session has a valid backend auth cookie
  const [isApiMode, setIsApiMode] = useState(false);

  useEffect(() => {
    const loadCartData = async () => {
      if (!dbPromise) return;

      try {
        const db = await dbPromise;
        const allCartItems = await db.getAll("cartStore");
        const initialCartData = new Map<string, Product>();
        allCartItems.forEach((item) => initialCartData.set(item.id, item));
        setCartDataState(initialCartData);
        if (process.env.NODE_ENV !== "production") {
          console.info("Cart data loaded from IndexedDB");
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load cart data:", error);
        }
      }
    };

    const loadWishlistData = async () => {
      setIsWishlistLoading(true);
      try {
        // Try API first – succeeds when backend session cookie is present
        const { data: apiItems } = await WishlistService.getWishlist();
        const apiMap = new Map<string, Product>();
        apiItems.forEach((item) =>
          apiMap.set(item.productId, apiItemToProduct(item)),
        );
        setWishlistDataState(apiMap);
        setIsApiMode(true);

        // Sync API state into IndexedDB as the local cache
        if (dbPromise) {
          const db = await dbPromise;
          await db.clear("wishlistStore");
          await Promise.all(
            Array.from(apiMap.values()).map((p) => db.put("wishlistStore", p)),
          );
        }
        if (process.env.NODE_ENV !== "production") {
          console.info("Wishlist data loaded from API and synced to IndexedDB");
        }
      } catch (apiError) {
        const isAuthError =
          apiError instanceof Error &&
          (apiError.message === "AUTH_REQUIRED" ||
            apiError.message.includes("401"));
        if (isAuthError) {
          // User not authenticated with backend – use IndexedDB (guest mode)
          if (process.env.NODE_ENV !== "production") {
            console.info("No backend session; loading wishlist from IndexedDB");
          }
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.warn("API unavailable; falling back to IndexedDB:", apiError);
          }
        }
        if (dbPromise) {
          try {
            const db = await dbPromise;
            const allWishlistItems = await db.getAll("wishlistStore");
            const idbMap = new Map<string, Product>();
            allWishlistItems.forEach((item) => idbMap.set(item.id, item));
            setWishlistDataState(idbMap);
            if (process.env.NODE_ENV !== "production") {
              console.info("Wishlist data loaded from IndexedDB");
            }
          } catch (idbError) {
            if (process.env.NODE_ENV !== "production") {
              console.error("Failed to load wishlist from IndexedDB:", idbError);
            }
          }
        }
      } finally {
        setIsWishlistLoading(false);
      }
    };

    loadCartData();
    loadWishlistData();
  }, []);

  const setCartData = async (cartItem: Product) => {
    if (!dbPromise) return;

    try {
      const newCartData = new Map(cartData);
      if (newCartData.has(cartItem.id)) {
        const existingItem = newCartData.get(cartItem.id)!;
        newCartData.set(cartItem.id, {
          ...existingItem,
          quantity: existingItem.quantity + (cartItem.quantity || 1),
        });
      } else {
        newCartData.set(cartItem.id, cartItem);
      }

      const db = await dbPromise;
      await db.put("cartStore", newCartData.get(cartItem.id)!);
      setCartDataState(newCartData);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to set cart data:", error);
      }
    }
  };

  const removeCartData = async (itemId: string) => {
    if (!dbPromise) return;

    try {
      const newCartData = new Map(cartData);
      if (newCartData.has(itemId)) {
        const item = newCartData.get(itemId)!;
        if (item.quantity > 1) {
          const updatedItem = { ...item, quantity: item.quantity - 1 };
          newCartData.set(itemId, updatedItem);
          const db = await dbPromise;
          await db.put("cartStore", updatedItem);
        } else {
          newCartData.delete(itemId);
          const db = await dbPromise;
          await db.delete("cartStore", itemId);
        }
      }
      setCartDataState(newCartData);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to remove cart data:", error);
      }
    }
  };

  const deleteCartData = async (itemId: string) => {
    if (!dbPromise) return;

    try {
      if (!cartData.has(itemId)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Item with id: ${itemId} does not exist`);
        }
        return;
      }

      const newCartData = new Map(cartData);
      newCartData.delete(itemId);
      setCartDataState(newCartData);

      const db = await dbPromise;
      await db.delete("cartStore", itemId);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to delete cart data:", error);
      }
    }
  };

  const getTotalPrice = (): number => {
    return Array.from(cartData.values()).reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  };

  const addWishlistItem = async (wishlistItem: Product) => {
    // Optimistic update: reflect change immediately in UI and IndexedDB
    const newWishlistData = new Map(wishlistData);
    newWishlistData.set(wishlistItem.id, wishlistItem);
    setWishlistDataState(newWishlistData);

    if (dbPromise) {
      try {
        const db = await dbPromise;
        await db.put("wishlistStore", wishlistItem);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to write wishlist item to IndexedDB:", error);
        }
      }
    }

    if (isApiMode) {
      try {
        await WishlistService.addToWishlist(wishlistItem.id);
      } catch (error) {
        if (error instanceof Error && error.message === "AUTH_REQUIRED") {
          setIsApiMode(false);
        } else if (
          error instanceof Error &&
          !error.message.includes("409") // 409 = already in wishlist, that's fine
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("API wishlist add failed (non-auth):", error.message);
          }
        }
      }
    }
  };

  const removeWishlistItem = async (itemId: string) => {
    // Optimistic update
    const newWishlistData = new Map(wishlistData);
    newWishlistData.delete(itemId);
    setWishlistDataState(newWishlistData);

    if (dbPromise) {
      try {
        const db = await dbPromise;
        await db.delete("wishlistStore", itemId);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to remove wishlist item from IndexedDB:", error);
        }
      }
    }

    if (isApiMode) {
      try {
        await WishlistService.removeFromWishlist(itemId);
      } catch (error) {
        if (error instanceof Error && error.message === "AUTH_REQUIRED") {
          setIsApiMode(false);
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.warn("API wishlist remove failed:", error);
          }
        }
      }
    }
  };

  const getTotalQuantity = () => {
    return Array.from(cartData.values()).reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  };

  const clearCart = async () => {
    if (!dbPromise) return;

    try {
      const db = await dbPromise;
      await db.clear("cartStore");
      setCartDataState(new Map());
      if (process.env.NODE_ENV !== "production") {
        console.info("Cart cleared successfully");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to clear cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        setCartData,
        removeCartData,
        deleteCartData,
        clearCart,
        getTotalPrice,
        getTotalQuantity,
      }}
    >
      <WishlistContext.Provider
        value={{
          wishlistData,
          addWishlistItem,
          removeWishlistItem,
          isLoading: isWishlistLoading,
        }}
      >
        {children}
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a CartProvider");
  }
  return context;
}
