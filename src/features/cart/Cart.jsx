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
    removeFromCart,
    isCartOpen,
    closeCart,
  } = useCart();

  const total = cart
    .reduce((acc, product) => acc + product.price * product.quantity, 0)
    .toFixed(2);

  const isEmpty = cart.length === 0;

  return (
    <aside className={`cart ${isCartOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={closeCart}>
        ✕
      </button>

      {isEmpty ? (
        <div className="emptyCart">
          <p>El carrito está vacío.</p>
        </div>
      ) : (
        <>
          <ul>
            {cart.map((product) => (
              <li key={product.id}>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={100}
                  height={100}
                />

                <div className="cartInfoContainer">
                  <div className="cartInfo">
                    <strong>{product.title}</strong>
                    <span className="productPrice">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <footer>
                    <div className="cartQuantityContainer">
                      <button onClick={() => decreaseQuantity(product.id)}>
                        -
                      </button>

                      <small>{product.quantity}</small>

                      <button onClick={() => increaseQuantity(product.id)}>
                        +
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(product.id)}>
                      Eliminar
                    </button>
                  </footer>
                </div>
              </li>
            ))}
          </ul>

          <p className="totalPrice">Total: ${total}</p>

          <button className="checkoutBtn">Finalizar Compra</button>
        </>
      )}
    </aside>
  );
}
