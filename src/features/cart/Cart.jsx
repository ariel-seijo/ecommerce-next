"use client";

import "./Cart.css";
import Image from "next/image";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/useCart";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const total = cart
    .reduce((acc, product) => acc + product.price * product.quantity, 0)
    .toFixed(2);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isEmpty = cart.length === 0;

  return (
    <aside className={`cart ${isCartOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h4>Carrito</h4>
        <span>{totalItems} {totalItems === 1 ? "ítem" : "ítems"}</span>
        <button className="close-btn" onClick={closeCart}>
          ✕
        </button>
      </div>

      {isEmpty ? (
        <div className="emptyCart">
          <ShoppingBag size={40} strokeWidth={1.5} />
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
                  width={64}
                  height={64}
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
                      <Trash2 size={14} />
                    </button>
                  </footer>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <div className="totalPrice">
              <span>Total</span>
              <strong>${total}</strong>
            </div>

            <button
              className="checkoutBtn"
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
            >
              COMPRAR
            </button>

            <button className="clear-btn" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
