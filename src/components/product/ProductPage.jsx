// src/components/product/ProductPage.jsx

"use client";

import "../../features/products/ProductCard.css";
import "./ProductPage.css";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/features/cart/useCart";
import ProductCard from "@/features/products/ProductCard";

export default function ProductPage({ product, relatedProducts }) {
  const { addToCart } = useCart();

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(images[0]);

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  const discount = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <main className="product-page">
      {/* breadcrumb */}
      <div className="pp-breadcrumb">
        <span>Inicio</span>
        <span>/</span>
        <span>{product.category.name}</span>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      {/* hero */}
      <section className="pp-hero">
        {/* gallery */}
        <div className="pp-gallery">
          <div className="pp-main-image">
            <Image
              src={selectedImage}
              alt={product.title}
              width={700}
              height={700}
              priority
            />
          </div>

          <div className="pp-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={
                  selectedImage === img ? "pp-thumb active" : "pp-thumb"
                }
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img} alt={product.title} width={100} height={100} />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="pp-info">
          <div className="pp-tags">
            <span className="pp-stock">
              {product.stock > 0 ? "En stock" : "Sin stock"}
            </span>

            <span className="pp-brand">{product.brand}</span>
          </div>

          <h1 className="pp-title">{product.title}</h1>

          <div className="pp-price-box">
            <span className="pp-price">
              ${product.price.toLocaleString("es-AR")}
            </span>

            {hasDiscount && (
              <>
                <span className="pp-old-price">
                  ${product.oldPrice.toLocaleString("es-AR")}
                </span>

                <span className="pp-discount">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="pp-description">{product.description}</p>

          <div className="pp-meta">
            <div className="pp-meta-box">
              <span className="pp-meta-label">Stock</span>
              <strong className="pp-meta-value">
                {product.stock} unidades
              </strong>
            </div>

            <div className="pp-meta-box">
              <span className="pp-meta-label">SKU</span>
              <strong className="pp-meta-value">{product.sku}</strong>
            </div>
          </div>

          <button
            className="pp-add-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>
        </div>
      </section>

      {/* related */}
      {relatedProducts.length > 0 && (
        <section className="pp-related">
          <h2 className="pp-related-title">Productos similares</h2>

          <div className="pp-related-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
