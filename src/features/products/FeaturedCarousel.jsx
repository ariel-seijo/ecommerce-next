"use client";

import "./FeaturedCarousel.css";
import ProductCard from "./ProductCard";

export default function FeaturedCarousel({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="fc" role="status">
        <p className="fc-empty">No hay productos destacados en este momento.</p>
      </div>
    );
  }

  return (
    <section
      className="fc"
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
    >
      <div className="fc-viewport">
        <div className="fc-scroll">
          {products.map((product) => (
            <div className="fc-card" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
          {products.map((product) => (
            <div className="fc-card" key={`dup-${product.id}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="fc-fade fc-fade-left" />
        <div className="fc-fade fc-fade-right" />
      </div>
    </section>
  );
}
