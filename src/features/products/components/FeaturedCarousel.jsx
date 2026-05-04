"use client";

import styles from "../styles/FeaturedCarousel.module.css";
import ProductCard from "./ProductCard";

export default function FeaturedCarousel({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className={styles.fc} role="status">
        <p className={styles["fc-empty"]}>No hay productos destacados en este momento.</p>
      </div>
    );
  }

  return (
    <section
      className={styles.fc}
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
    >
      <div className={styles["fc-viewport"]}>
        <div className={styles["fc-scroll"]}>
          {products.map((product) => (
            <div className={styles["fc-card"]} key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
          {products.map((product) => (
            <div className={styles["fc-card"]} key={`dup-${product.id}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className={`${styles["fc-fade"]} ${styles["fc-fade-left"]}`} />
        <div className={`${styles["fc-fade"]} ${styles["fc-fade-right"]}`} />
      </div>
    </section>
  );
}
