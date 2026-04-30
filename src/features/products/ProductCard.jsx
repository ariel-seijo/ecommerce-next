"use client";

import "./ProductCard.css";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/features/cart/useCart";

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isInCart = !isOutOfStock && cart.some((item) => item.id === product.id);

  return (
    <li className="card">
      <Link href={`/product/${product.slug}`} className="cardLink">
        <div className="img-container">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 220px"
            priority={product.id <= 2}
          />
        </div>

        <div className="meta">
          <div className="topMeta">
            <span className="category">{product.category?.name}</span>

            <span className="brand">{product.brand}</span>
          </div>

          <h3 className="title">{product.title}</h3>

          <div className="ratingRow">
            <Star size={14} fill="currentColor" />

            <span>{product.rating.toFixed(1)}</span>

            <small>({product.sold} vendidos)</small>
          </div>

          <div className="priceBlock">
            {product.oldPrice > product.price && (
              <span className="oldPrice">${product.oldPrice.toFixed(2)}</span>
            )}

            <span className="price">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>

      <button
        className={`buy-btn ${isInCart ? "in-cart" : ""} ${
          isOutOfStock ? "out-stock" : ""
        }`}
        onClick={() => addToCart(product)}
        disabled={isInCart || isOutOfStock}
      >
        <span className="content">
          {!isOutOfStock && isInCart && (
            <ShoppingCart size={18} className="cart-icon" />
          )}

          <span className="text">
            {isOutOfStock
              ? "Sin stock"
              : isInCart
                ? "Añadido"
                : "Añadir al carrito"}
          </span>
        </span>
      </button>
    </li>
  );
}
