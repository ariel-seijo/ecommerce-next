"use client";

import "./Products.css";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/features/cart/useCart";

export default function Products({ products }) {
  const { addToCart } = useCart();
  return (
    <main className="products">
      <ul>
        {products.map((product) => (
          <li key={product.id} className="card">
            <div className="img-container">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1200px) 25vw, 200px"
                priority={product.id <= 2}
                loading="eager"
              />
            </div>

            <div className="info">
              <h3>{product.title}</h3>
              <span className="price">Precio: ${product.price}</span>
            </div>

            <button
              className="buy-btn"
              onClick={() => {
                console.log("adding", product);
                addToCart(product);
              }}
            >
              <ShoppingCart />
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
