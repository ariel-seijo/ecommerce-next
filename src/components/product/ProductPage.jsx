"use client";

import "./ProductPage.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/features/cart/useCart";
import ProductCard from "@/features/products/ProductCard";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Check,
  Minus,
  Plus,
  PackageOpen,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

export default function ProductPage({ product, relatedProducts }) {
  const { addToCart, cart } = useCart();

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const isInCart = cart.some((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <main className="product-page">
      <nav className="pp-breadcrumb">
        <Link href="/">Inicio</Link>
        <ChevronRight size={14} />
        <Link href={`/category/${product.category.name.toLowerCase()}`}>
          {product.category.name}
        </Link>
        <ChevronRight size={14} />
        <span>{product.title}</span>
      </nav>

      <section className="pp-hero">
        <div className="pp-gallery">
          <div
            className={`pp-main-image ${isZoomed ? "zoomed" : ""}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={selectedImage}
              alt={product.title}
              width={700}
              height={700}
              priority
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />
          </div>

          {images.length > 1 && (
            <div className="pp-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pp-thumb ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.title} - vista ${i + 1}`}
                    width={100}
                    height={100}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pp-info">
          <div className="pp-tags">
            {isOutOfStock ? (
              <span className="pp-tag pp-tag-out">Agotado</span>
            ) : isLowStock ? (
              <span className="pp-tag pp-tag-low">
                Últimas {product.stock} unidades
              </span>
            ) : (
              <span className="pp-tag pp-tag-stock">
                <Check size={14} />
                En stock
              </span>
            )}

            <span className="pp-tag pp-tag-brand">{product.brand}</span>

            {product.featured && (
              <span className="pp-tag pp-tag-featured">Destacado</span>
            )}
          </div>

          <h1 className="pp-title">{product.title}</h1>

          <div className="pp-rating">
            <div className="pp-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(product.rating) ? "#24abf3" : "none"}
                  color={i < Math.round(product.rating) ? "#24abf3" : "rgb(80,80,80)"}
                />
              ))}
            </div>
            <span className="pp-rating-value">{product.rating.toFixed(1)}</span>
            <span className="pp-rating-sep">|</span>
            <span className="pp-rating-sold">{product.sold} vendidos</span>
          </div>

          <div className="pp-price-box">
            <div className="pp-price-main">
              <span className="pp-price">
                ${product.price.toLocaleString("es-AR")}
              </span>
              {hasDiscount && (
                <>
                  <span className="pp-old-price">
                    ${product.oldPrice.toLocaleString("es-AR")}
                  </span>
                  <span className="pp-discount">-{discount}%</span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p className="pp-savings">
                Ahorrás ${(product.oldPrice - product.price).toLocaleString("es-AR")} ({discount}% OFF)
              </p>
            )}
          </div>

          <p className="pp-description">{product.description}</p>

          <div className="pp-meta">
            <div className="pp-meta-box">
              <PackageOpen size={18} />
              <div>
                <span className="pp-meta-label">SKU</span>
                <strong className="pp-meta-value">{product.sku}</strong>
              </div>
            </div>
            <div className="pp-meta-box">
              <ShieldCheck size={18} />
              <div>
                <span className="pp-meta-label">Garantía</span>
                <strong className="pp-meta-value">12 meses</strong>
              </div>
            </div>
            <div className="pp-meta-box">
              <Truck size={18} />
              <div>
                <span className="pp-meta-label">Stock</span>
                <strong className="pp-meta-value">
                  {product.stock > 0 ? `${product.stock} unidades` : "Sin stock"}
                </strong>
              </div>
            </div>
            <div className="pp-meta-box">
              <RotateCcw size={18} />
              <div>
                <span className="pp-meta-label">Devolución</span>
                <strong className="pp-meta-value">30 días</strong>
              </div>
            </div>
          </div>

          <div className="pp-actions">
            <div className="pp-qty">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              className={`pp-add-btn ${added ? "added" : ""} ${isInCart ? "in-cart" : ""}`}
              onClick={handleAdd}
              disabled={isOutOfStock}
            >
              {added ? (
                <>
                  <Check size={18} />
                  Añadido
                </>
              ) : isOutOfStock ? (
                "Sin stock"
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>

          <div className="pp-features">
            <div className="pp-feature-item">
              <Truck size={16} />
              <span>
                Envío gratis en compras superiores a $50.000
              </span>
            </div>
            <div className="pp-feature-item">
              <ShieldCheck size={16} />
              <span>Garantía oficial del fabricante</span>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="pp-related">
          <div className="pp-related-header">
            <h2 className="pp-related-title">Productos similares</h2>
            <Link
              href={`/category/${product.category.name.toLowerCase()}`}
              className="pp-related-link"
            >
              Ver todos
              <ChevronRight size={16} />
            </Link>
          </div>

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
