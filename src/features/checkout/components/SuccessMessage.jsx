"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import styles from "../styles/Success.module.css";

export default function SuccessMessage({ email }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>
        <Check size={40} strokeWidth={2} />
      </div>
      <h2>¡Pedido Confirmado!</h2>
      <p>
        Gracias por tu compra. Te enviamos un email con los detalles a{" "}
        <strong>{email}</strong>.
      </p>
      <Link href="/" className={styles.backLink}>
        Volver a la tienda
      </Link>
    </div>
  );
}
