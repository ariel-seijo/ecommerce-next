"use client";

import Image from "next/image";
import { useCart } from "@/features/cart";
import styles from "../styles/OrderSummary.module.css";

export default function OrderSummary() {
  const { cart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50000 ? 0 : 3500;
  const total = subtotal + shippingCost;

  return (
    <div className={styles.summary}>
      <h3>Resumen de Compra</h3>

      <ul className={styles.items}>
        {cart.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemImg}>
              <Image src={item.thumbnail} alt={item.title} width={48} height={48} />
              <span className={styles.qtyBadge}>{item.quantity}</span>
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>{item.title}</span>
            </div>
            <span className={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.divider} />

      <div className={styles.row}>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className={styles.row}>
        <span>Envío</span>
        <span className={shippingCost === 0 ? styles.freeShipping : ""}>
          {shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`}
        </span>
      </div>

      {shippingCost > 0 && (
        <p className={styles.hint}>¡Envío gratis en compras superiores a $50.000!</p>
      )}

      <div className={styles.divider} />

      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
