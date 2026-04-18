"use client";

import "./Cart.css";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/useCart";

export function Cart() {
  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    isCartOpen,
    closeCart,
  } = useCart();

  const total = cart
    .reduce((acc, product) => acc + product.price * product.quantity, 0)
    .toFixed(2);
  console.log("cart", cart);
  return (
    <aside className={`cart ${isCartOpen ? "open" : ""}`}>
      {/* botón cerrar */}
      <button className="close-btn" onClick={closeCart}>
        ✕
      </button>

      <ul>
        {cart.map((product) => (
          <li key={product.id}>
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={100}
              height={100}
            />
            <div>
              <strong>{product.title}</strong> - ${product.price}
            </div>
            <footer>
              <small>Qty: {product.quantity}</small>
              <button onClick={() => increaseQuantity(product.id)}>+</button>
              <button onClick={() => decreaseQuantity(product.id)}>-</button>
            </footer>
          </li>
        ))}
      </ul>

      <button onClick={clearCart}>
        <Trash2 />
      </button>

      <p>Total: ${total}</p>
    </aside>
  );
}
