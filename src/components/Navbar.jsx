"use client";

import "./Navbar.css";
import { useState } from "react";
import { useCart } from "@/features/cart/useCart";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">🛒 MyShop</div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {/* Acciones */}
      <div className="actions">
        {/* Login */}
        <button className="icon-btn">👤</button>

        {/* Carrito */}
        <button className="icon-btn cart-btn">
          🛒
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </button>
      </div>
    </nav>
  );
}
