"use client";

import "./ProductCard.css";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Check, Flame } from "lucide-react";
import { useCart } from "@/features/cart/useCart";

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isInCart = !isOutOfStock && cart.some((item) => item.id === product.id);
  const discountPercent =
    product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const buyLabel = isInCart
    ? `${product.title} ya está en el carrito`
    : isOutOfStock
      ? `${product.title} sin stock disponible`
      : `Añadir ${product.title} al carrito`;

  return (
    <li className="card">
      <Link
        href={`/product/${product.slug}`}
        className="cardLink"
        aria-label={`Ver detalles de ${product.title}`}
      >
        <div className="img-container">
          <Image
            src={product.thumbnail}
            alt={`${product.title} - ${product.brand}`}
            fill
            sizes="(max-width: 480px) 90vw, (max-width: 1024px) 50vw, 33vw"
            priority={product.id <= 2}
          />

          {discountPercent > 0 && (
            <span className="discount-badge" aria-label={`${discountPercent} por ciento de descuento`}>
              -{discountPercent}%
            </span>
          )}

          {isOutOfStock && (
            <span className="stock-badge out" role="status">
              AGOTADO
            </span>
          )}
          {isLowStock && (
            <span className="stock-badge low" role="status">
              {product.stock} disponibles
            </span>
          )}
          {product.featured && !isOutOfStock && (
            <span className="featured-badge">
              <Flame size={12} aria-hidden="true" />
              DESTACADO
            </span>
          )}
        </div>

        <div className="meta">
          <div className="topMeta">
            <span className="category">{product.category?.name}</span>
            <span className="brand">{product.brand}</span>
          </div>

          <h3 className="title">{product.title}</h3>

          <div className="ratingRow">
            <div className="stars" aria-label={`${product.rating} de 5 estrellas`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  aria-hidden="true"
                  fill={i < Math.floor(product.rating) ? "#24abf3" : "none"}
                  color={i < Math.floor(product.rating) ? "#24abf3" : "rgb(80, 80, 80)"}
                />
              ))}
            </div>
            <span>{product.rating.toFixed(1)}</span>
            <small>({product.sold} vendidos)</small>
          </div>

          <div className="priceBlock">
            {product.oldPrice > product.price && (
              <span className="oldPrice" aria-label={`Precio anterior ${product.oldPrice} pesos`}>
                ${product.oldPrice.toLocaleString("es-AR")}
              </span>
            )}
            <span className="price" aria-label={`Precio actual ${product.price} pesos`}>
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </Link>

      <button
        className={`buy-btn ${isInCart ? "in-cart" : ""} ${isOutOfStock ? "out-stock" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          addToCart(product);
        }}
        disabled={isInCart || isOutOfStock}
        aria-label={buyLabel}
        aria-disabled={isInCart || isOutOfStock}
      >
        <span className="content">
          {isInCart ? (
            <>
              <Check size={16} aria-hidden="true" />
              <span className="text">Añadido</span>
            </>
          ) : isOutOfStock ? (
            <span className="text">Sin stock</span>
          ) : (
            <>
              <ShoppingCart size={16} aria-hidden="true" />
              <span className="text">Añadir al carrito</span>
            </>
          )}
        </span>
      </button>
    </li>
  );
}
