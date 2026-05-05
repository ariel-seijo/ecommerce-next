"use client";

import styles from "../styles/Products.module.css";
import ProductCard from "./ProductCard";

export default function Products({ products, view = "grid" }) {
  const isList = view === "list";

  return (
    <main className={`${styles.products} ${isList ? styles.list : ""}`}>
      <ul>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </ul>
    </main>
  );
}
