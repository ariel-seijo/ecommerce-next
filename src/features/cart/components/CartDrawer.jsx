"use client";

import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
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
    <aside className={`${styles.cart} ${isCartOpen ? styles.open : ""}`}>
      <div className={styles["cart-header"]}>
        <h4>Carrito</h4>
        <span>{totalItems} {totalItems === 1 ? "ítem" : "ítems"}</span>
        <button className={styles["close-btn"]} onClick={closeCart}>
          ✕
        </button>
      </div>

      {isEmpty ? (
        <div className={styles.emptyCart}>
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

                <div className={styles.cartInfoContainer}>
                  <div className={styles.cartInfo}>
                    <strong>{product.title}</strong>
                    <span className={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <footer>
                    <div className={styles.cartQuantityContainer}>
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

          <div className={styles["cart-footer"]}>
            <div className={styles.totalPrice}>
              <span>Total</span>
              <strong>${total}</strong>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
            >
              COMPRAR
            </button>

            <button className={styles["clear-btn"]} onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
