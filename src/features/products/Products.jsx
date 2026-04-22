"use client";

import "./Products.css";
import ProductCard from "./ProductCard";

export default function Products({ products }) {
  return (
    <main className="products">
      <ul>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </main>
  );
}
