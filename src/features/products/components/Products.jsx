"use client";

import styles from "../styles/Products.module.css";
import ProductCard from "./ProductCard";

export default function Products({ products }) {
  return (
    <main className={styles.products}>
      <ul>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </main>
  );
}
