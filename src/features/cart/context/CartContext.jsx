"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useAuthStore } from "@/features/auth";
import { cartReducer, initialState } from "./CartReducer";
import { syncCart } from "../actions/syncCart";
import { fetchCart } from "../actions/fetchCart";
import { saveCart } from "../actions/saveCart";

export const CartContext = createContext();

const CART_STORAGE_KEY = "cart";
const CART_SYNCED_KEY = "cart_is_synced";

function isClient() {
  return typeof window !== "undefined";
}

/**
 * Maps server CartItem (with product include) to the client cart item shape.
 */
function mapDbCartToClient(dbCart) {
  return dbCart.map((item) => ({
    id: item.product.id,
    title: item.product.title,
    slug: item.product.slug,
    price: item.product.price,
    oldPrice: item.product.oldPrice,
    thumbnail: item.product.thumbnail,
    stock: item.product.stock,
    brand: item.product.brand,
    categoryId: item.product.categoryId,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const user = useAuthStore((s) => s.user);
  const prevUser = useRef(user);

  // -------------------------------------------------------
  // Hydrate from localStorage on mount (SSR-safe)
  // -------------------------------------------------------
  useEffect(() => {
    if (!isClient()) return;
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
    }
  }, []);

  // -------------------------------------------------------
  // Persist cart to localStorage on every change
  // -------------------------------------------------------
  useEffect(() => {
    if (!isClient()) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  // -------------------------------------------------------
  // Multi-tab synchronization via storage event
  // -------------------------------------------------------
  useEffect(() => {
    if (!isClient()) return;

    const handleStorage = (e) => {
      if (e.key === CART_SYNCED_KEY && e.newValue === "true") {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          fetchCart()
            .then((dbCart) => {
              dispatch({
                type: "SET_CART",
                payload: mapDbCartToClient(dbCart),
              });
            })
            .catch(() => {
              /* silently ignore fetch errors */
            });
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // -------------------------------------------------------
  // Auto-persist cart to DB on every change (debounced 2s)
  // Keeps the DB in sync during the session so logout never loses changes
  // -------------------------------------------------------
  const saveTimerRef = useRef(null);

  useEffect(() => {
    if (!isClient() || !user) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    saveTimerRef.current = setTimeout(() => {
      saveCart(items).catch((err) => {
        console.error("Auto-save cart failed:", err.message);
      });
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [cart, user]);

  // -------------------------------------------------------
  // Core sync logic
  // -------------------------------------------------------
  const performSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const wasSynced =
        isClient() && localStorage.getItem(CART_SYNCED_KEY) === "true";

      // Already synced — just fetch DB cart (handles multi-tab / re-login)
      if (wasSynced) {
        const dbCart = await fetchCart();
        dispatch({ type: "SET_CART", payload: mapDbCartToClient(dbCart) });
        return;
      }

      // Guest cart is empty but user is logged in — load DB cart
      if (cart.length === 0) {
        const dbCart = await fetchCart();
        dispatch({ type: "SET_CART", payload: mapDbCartToClient(dbCart) });
        try {
          localStorage.setItem(CART_SYNCED_KEY, "true");
        } catch {
          /* ignore */
        }
        return;
      }

      // Guest cart has items — merge with DB
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const dbCart = await syncCart(items);

      // Server confirmed success — safe to clear localStorage guest cart
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.setItem(CART_SYNCED_KEY, "true");
      } catch {
        /* ignore */
      }

      // DB is the source of truth — replace client state entirely
      dispatch({ type: "SET_CART", payload: mapDbCartToClient(dbCart) });
    } catch (error) {
      console.error("Cart sync failed — guest cart preserved:", error.message);
      // localStorage is NOT cleared — guest cart remains intact
    } finally {
      setIsSyncing(false);
    }
  }, [cart, isSyncing]);

  // Ref to latest performSync so the login effect doesn't need it as a dep
  const performSyncRef = useRef(performSync);
  performSyncRef.current = performSync;

  // Ref to latest cart so the logout flush reads current items without [cart] dep
  const cartRef = useRef(cart);
  cartRef.current = cart;

  // -------------------------------------------------------
  // Handle login / logout transitions
  // -------------------------------------------------------
  useEffect(() => {
    if (!isClient()) return;

    const wasLoggedIn = !!prevUser.current;
    const isLoggedIn = !!user;

    // User just logged in — restore DB cart automatically
    if (!wasLoggedIn && isLoggedIn) {
      performSyncRef.current();
    }

    // User just logged out — flush cart to DB, then reset state
    if (wasLoggedIn && !isLoggedIn) {
      // Clear any pending auto-save timer and flush immediately
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      if (cartRef.current.length > 0) {
        const items = cartRef.current.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }));
        // Fire-and-forget — cookie may still be valid at this point
        saveCart(items).catch(() => {});
      }

      try {
        localStorage.removeItem(CART_SYNCED_KEY);
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      dispatch({ type: "CLEAR_CART" });
    }

    prevUser.current = user;
  }, [user]);

  /**
   * Public method callable from login page or any consumer.
   * Safe to call multiple times — idempotent via cart_is_synced flag.
   */
  const syncGuestCart = useCallback(async () => {
    if (!useAuthStore.getState().user) return;
    await performSync();
  }, [performSync]);

  // --- Standard cart operations ---

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const increaseQuantity = (id) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: id });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        syncGuestCart,
        isSyncing,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
