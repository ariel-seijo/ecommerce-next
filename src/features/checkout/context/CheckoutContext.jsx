"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { useCart } from "@/features/cart";
import { SHIPPING_DEMO, PAYMENT_DEMO } from "@/mocks/checkoutDemoData";

const STORAGE_KEY = "checkout_state";

const initialState = {
  step: 0,
  shipping: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
    zip: "",
    notes: "",
  },
  paymentMethod: "card",
  cardDetails: {
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardHolder: "",
  },
  isProcessing: false,
  isConfirmed: false,
  orderError: null,
};

function checkoutReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };

    case "SET_SHIPPING_FIELD":
      return {
        ...state,
        shipping: { ...state.shipping, [action.name]: action.value },
      };

    case "AUTO_FILL_SHIPPING":
      return { ...state, shipping: { ...SHIPPING_DEMO } };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.method };

    case "SET_CARD_FIELD":
      return {
        ...state,
        cardDetails: { ...state.cardDetails, [action.name]: action.value },
      };

    case "AUTO_FILL_PAYMENT":
      return {
        ...state,
        paymentMethod: PAYMENT_DEMO.method,
        cardDetails: {
          cardNumber: PAYMENT_DEMO.cardNumber,
          cardExpiry: PAYMENT_DEMO.cardExpiry,
          cardCvc: PAYMENT_DEMO.cardCvc,
          cardHolder: PAYMENT_DEMO.cardHolder,
        },
      };

    case "SET_STEP":
      return { ...state, step: action.step };

    case "PLACE_ORDER_START":
      return { ...state, isProcessing: true, orderError: null };

    case "PLACE_ORDER_SUCCESS":
      return { ...state, isProcessing: false, isConfirmed: true };

    case "PLACE_ORDER_ERROR":
      return { ...state, isProcessing: false, orderError: action.error };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

function isClient() {
  return typeof window !== "undefined";
}

function loadFromStorage() {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  if (!isClient()) return;
  try {
    const toSave = {
      step: state.step,
      shipping: state.shipping,
      paymentMethod: state.paymentMethod,
      cardDetails: state.cardDetails,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    /* noop */
  }
}

function clearStorage() {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const initialized = useRef(false);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!isClient() || initialized.current) return;
    const saved = loadFromStorage();
    if (saved) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
    initialized.current = true;
  }, []);

  const { shipping, paymentMethod, cardDetails, step } = state;

  useEffect(() => {
    if (!initialized.current) return;
    saveToStorage({ shipping, paymentMethod, cardDetails, step });
  }, [shipping, paymentMethod, cardDetails, step]);

  const setShippingField = useCallback((name, value) => {
    dispatch({ type: "SET_SHIPPING_FIELD", name, value });
  }, []);

  const autoFillShipping = useCallback(() => {
    dispatch({ type: "AUTO_FILL_SHIPPING" });
  }, []);

  const setPaymentMethod = useCallback((method) => {
    dispatch({ type: "SET_PAYMENT_METHOD", method });
  }, []);

  const setCardField = useCallback((name, value) => {
    dispatch({ type: "SET_CARD_FIELD", name, value });
  }, []);

  const autoFillPayment = useCallback(() => {
    dispatch({ type: "AUTO_FILL_PAYMENT" });
  }, []);

  const goToStep = useCallback((step) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const goNext = useCallback(() => {
    dispatch({ type: "SET_STEP", step: state.step + 1 });
  }, [state.step]);

  const goPrev = useCallback(() => {
    dispatch({ type: "SET_STEP", step: Math.max(0, state.step - 1) });
  }, [state.step]);

  const placeOrder = useCallback(() => {
    dispatch({ type: "PLACE_ORDER_START" });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate ~10% error rate to demo error path
        if (Math.random() < 0.1) {
          const error = "Error al procesar el pago. Verificá tus datos e intentá nuevamente.";
          dispatch({ type: "PLACE_ORDER_ERROR", error });
          reject(new Error(error));
        } else {
          dispatch({ type: "PLACE_ORDER_SUCCESS" });
          clearCart();
          clearStorage();
          resolve();
        }
      }, 2000);
    });
  }, [clearCart]);

  const resetCheckout = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const value = {
    ...state,
    setShippingField,
    autoFillShipping,
    setPaymentMethod,
    setCardField,
    autoFillPayment,
    goToStep,
    goNext,
    goPrev,
    placeOrder,
    resetCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return ctx;
}
