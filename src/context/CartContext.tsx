"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import { useAuth } from "@/context/SupabaseAuthContext";
import { Product } from "@/utils/types";
import {
  WishlistService,
  type WishlistApiItem,
} from "@/lib/api/wishlistService";
import { CartService, type CartApiItem } from "@/lib/api/cartService";
import {
  loadCartItems,
  saveCartItem,
  deleteCartItem,
  clearCartIDB,
} from "@/utils/idb/cart.idb";

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
interface WishlistDB extends DBSchema {
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

function cartApiItemToProduct(item: CartApiItem): Product {
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
    description: item.productDescription,
    material: item.productMaterial,
    quantity: item.quantity,
    category: item.productCategory,
    slug: item.productSlug,
  };
}

// Initialize IndexedDB only if in the browser
let dbPromise: Promise<IDBPDatabase<WishlistDB>> | undefined;
if (typeof window !== "undefined") {
  dbPromise = openDB<WishlistDB>("cartDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("wishlistStore")) {
        db.createObjectStore("wishlistStore", { keyPath: "id" });
      }
    },
  });
}

export default function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth();
  const userId = user?.id;
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
    // console.info({
    //   cartData,
    //   wishlistData,
    // });
  }, [cartData, wishlistData]);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const cartMap = await loadCartItems();
        setCartDataState(cartMap);
        console.info("Cart data loaded from IDB (with TTL)");
      } catch (error) {
        console.error("Failed to load cart data:", error);
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
        console.info("Wishlist data loaded from API and synced to IndexedDB");
      } catch (apiError) {
        const isAuthError =
          apiError instanceof Error &&
          (apiError.message === "AUTH_REQUIRED" ||
            apiError.message.includes("401"));
        if (isAuthError) {
          // User not authenticated with backend – use IndexedDB (guest mode)
          console.info("No backend session; loading wishlist from IndexedDB");
        } else {
          console.warn("API unavailable; falling back to IndexedDB:", apiError);
        }
        if (dbPromise) {
          try {
            const db = await dbPromise;
            const allWishlistItems = await db.getAll("wishlistStore");
            const idbMap = new Map<string, Product>();
            allWishlistItems.forEach((item) => idbMap.set(item.id, item));
            setWishlistDataState(idbMap);
            console.info("Wishlist data loaded from IndexedDB");
          } catch (idbError) {
            console.error("Failed to load wishlist from IndexedDB:", idbError);
          }
        }
      } finally {
        setIsWishlistLoading(false);
      }
    };

    loadCartData();
    loadWishlistData();
  }, []);

  const syncCartCache = async (cartMap: Map<string, Product>) => {
    await clearCartIDB();
    await Promise.all(
      Array.from(cartMap.values()).map((item) => saveCartItem(item)),
    );
  };

  useEffect(() => {
    if (userId) {
      void (async () => {
        try {
          const { data: apiItems } = await CartService.getCart();
          const apiMap = new Map<string, Product>();
          apiItems.forEach((item) =>
            apiMap.set(item.productId, cartApiItemToProduct(item)),
          );
          setCartDataState(apiMap);
          await syncCartCache(apiMap);
        } catch (error) {
          console.warn(
            "Failed to load cart from API; falling back to IDB:",
            error,
          );
        }
      })();
      return;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      void (async () => {
        setIsWishlistLoading(true);
        try {
          const { data: apiItems } = await WishlistService.getWishlist();
          const apiMap = new Map<string, Product>();
          apiItems.forEach((item) =>
            apiMap.set(item.productId, apiItemToProduct(item)),
          );
          setWishlistDataState(apiMap);
          setIsApiMode(true);

          if (dbPromise) {
            const db = await dbPromise;
            await db.clear("wishlistStore");
            await Promise.all(
              Array.from(apiMap.values()).map((product) =>
                db.put("wishlistStore", product),
              ),
            );
          }
        } catch (error) {
          console.warn("Failed to re-sync wishlist after auth change:", error);
        } finally {
          setIsWishlistLoading(false);
        }
      })();
      return;
    }

    setIsApiMode(false);
  }, [userId]);

  const setCartData = async (cartItem: Product) => {
    try {
      let itemToSave: Product = cartItem;

      setCartDataState((prev) => {
        const newCartData = new Map(prev);
        if (newCartData.has(cartItem.id)) {
          const existingItem = newCartData.get(cartItem.id)!;
          itemToSave = {
            ...existingItem,
            quantity: existingItem.quantity + (cartItem.quantity || 1),
            originalPrice: cartItem.originalPrice ?? existingItem.originalPrice,
          };
        } else {
          itemToSave = cartItem;
        }
        newCartData.set(cartItem.id, itemToSave);
        return newCartData;
      });

      await saveCartItem(itemToSave);

      if (userId) {
        void (async () => {
          try {
            const { data } = await CartService.addToCart(
              cartItem.id,
              cartItem.quantity || 1,
            );
            const syncedProduct = {
              ...cartApiItemToProduct(data),
              originalPrice: cartItem.originalPrice,
            };
            setCartDataState((prevCartData) => {
              const syncedCartData = new Map(prevCartData);
              syncedCartData.set(syncedProduct.id, syncedProduct);
              return syncedCartData;
            });
            await saveCartItem(syncedProduct);
          } catch (error) {
            console.warn(
              "Cart API add failed after optimistic local save:",
              error,
            );
          }
        })();
      }
    } catch (error) {
      console.error("Failed to set cart data:", error);
    }
  };

  const removeCartData = async (itemId: string) => {
    try {
      const newCartData = new Map(cartData);
      if (newCartData.has(itemId)) {
        const item = newCartData.get(itemId)!;
        if (item.quantity > 1) {
          const updatedItem = { ...item, quantity: item.quantity - 1 };
          newCartData.set(itemId, updatedItem);
          await saveCartItem(updatedItem);
        } else {
          newCartData.delete(itemId);
          await deleteCartItem(itemId);
        }
      }
      setCartDataState(newCartData);

      if (userId && cartData.has(itemId)) {
        const item = cartData.get(itemId)!;
        void (async () => {
          try {
            if (item.quantity > 1) {
              const { data } = await CartService.updateCartItem(
                itemId,
                item.quantity - 1,
              );
              const syncedItem = cartApiItemToProduct(data);
              setCartDataState((prevCartData) => {
                const syncedCartData = new Map(prevCartData);
                syncedCartData.set(itemId, syncedItem);
                return syncedCartData;
              });
              await saveCartItem(syncedItem);
            } else {
              await CartService.removeFromCart(itemId);
            }
          } catch (error) {
            console.warn(
              "Cart API remove failed after optimistic local update:",
              error,
            );
          }
        })();
      }
    } catch (error) {
      console.error("Failed to remove cart data:", error);
    }
  };

  const deleteCartData = async (itemId: string) => {
    try {
      if (!cartData.has(itemId)) {
        console.warn(`Item with id: ${itemId} does not exist`);
        return;
      }

      const newCartData = new Map(cartData);
      newCartData.delete(itemId);
      setCartDataState(newCartData);
      await deleteCartItem(itemId);

      if (userId) {
        void (async () => {
          try {
            await CartService.removeFromCart(itemId);
          } catch (error) {
            console.warn(
              "Cart API delete failed after optimistic local update:",
              error,
            );
          }
        })();
      }
    } catch (error) {
      console.error("Failed to delete cart data:", error);
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
        console.error("Failed to write wishlist item to IndexedDB:", error);
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
          console.warn("API wishlist add failed (non-auth):", error.message);
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
        console.error("Failed to remove wishlist item from IndexedDB:", error);
      }
    }

    if (isApiMode) {
      try {
        await WishlistService.removeFromWishlist(itemId);
      } catch (error) {
        if (error instanceof Error && error.message === "AUTH_REQUIRED") {
          setIsApiMode(false);
        } else {
          console.warn("API wishlist remove failed:", error);
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
    try {
      await clearCartIDB();
      setCartDataState(new Map());
      console.info("Cart cleared successfully");

      if (userId) {
        void (async () => {
          try {
            await CartService.clearCart();
          } catch (error) {
            console.warn(
              "Cart API clear failed after optimistic local update:",
              error,
            );
          }
        })();
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
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
