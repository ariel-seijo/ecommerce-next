"use client";

import "./Navbar.css";
import { useState } from "react";
import { useCart } from "@/features/cart/useCart";
import Image from "next/image";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const { cart } = useCart();
  const { toggleCart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Image
            src="/logo-eshop.png"
            alt="Eshop Logo"
            width={377}
            height={69}
            priority
          />
        </div>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />
        <div className="actions">
          <button className="icon-btn">👤</button>
          <button className="icon-btn cart-btn" onClick={toggleCart}>
            🛒
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </button>
        </div>
      </nav>
      <div className="rgbbar"></div>
    </>
  );
}
