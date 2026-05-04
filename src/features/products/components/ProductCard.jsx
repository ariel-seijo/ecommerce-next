"use client";

import styles from "../styles/ProductCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Check, Flame } from "lucide-react";
import { useCart } from "@/features/cart";

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
    <li className={styles.card}>
      <Link
        href={`/product/${product.slug}`}
        className={styles.cardLink}
        aria-label={`Ver detalles de ${product.title}`}
      >
        <div className={styles["img-container"]}>
          <Image
            src={product.thumbnail}
            alt={`${product.title} - ${product.brand}`}
            fill
            sizes="(max-width: 480px) 90vw, (max-width: 1024px) 50vw, 33vw"
            priority={product.id <= 2}
          />

          {discountPercent > 0 && (
            <span className={styles["discount-badge"]} aria-label={`${discountPercent} por ciento de descuento`}>
              -{discountPercent}%
            </span>
          )}

          {isOutOfStock && (
            <span className={`${styles["stock-badge"]} ${styles.out}`} role="status">
              AGOTADO
            </span>
          )}
          {isLowStock && (
            <span className={`${styles["stock-badge"]} ${styles.low}`} role="status">
              {product.stock} disponibles
            </span>
          )}
          {product.featured && !isOutOfStock && (
            <span className={styles["featured-badge"]}>
              <Flame size={12} aria-hidden="true" />
              DESTACADO
            </span>
          )}
        </div>

        <div className={styles.meta}>
          <div className={styles.topMeta}>
            <span className={styles.category}>{product.category?.name}</span>
            <span className={styles.brand}>{product.brand}</span>
          </div>

          <h3 className={styles.title}>{product.title}</h3>

          <div className={styles.ratingRow}>
            <div className={styles.stars} aria-label={`${product.rating} de 5 estrellas`}>
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

          <div className={styles.priceBlock}>
            {product.oldPrice > product.price && (
              <span className={styles.oldPrice} aria-label={`Precio anterior ${product.oldPrice} pesos`}>
                ${product.oldPrice.toLocaleString("es-AR")}
              </span>
            )}
            <span className={styles.price} aria-label={`Precio actual ${product.price} pesos`}>
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </Link>

      <button
        className={`${styles["buy-btn"]} ${isInCart ? styles["in-cart"] : ""} ${isOutOfStock ? styles["out-stock"] : ""}`}
        onClick={(e) => {
          e.preventDefault();
          addToCart(product);
        }}
        disabled={isInCart || isOutOfStock}
        aria-label={buyLabel}
        aria-disabled={isInCart || isOutOfStock}
      >
        <span className={styles.content}>
          {isInCart ? (
            <>
              <Check size={16} aria-hidden="true" />
              <span className={styles.text}>Añadido</span>
            </>
          ) : isOutOfStock ? (
            <span className={styles.text}>Sin stock</span>
          ) : (
            <>
              <ShoppingCart size={16} aria-hidden="true" />
              <span className={styles.text}>Añadir al carrito</span>
            </>
          )}
        </span>
      </button>
    </li>
  );
}
