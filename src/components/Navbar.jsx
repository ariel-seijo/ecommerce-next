"use client";

import "./Navbar.css";
import Container from "@/components/Container";
import { useState } from "react";
import { useCart } from "@/features/cart/useCart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon, UserRound } from "lucide-react";
import { Cart } from "@/features/cart/Cart";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const { cart, toggleCart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (href) => pathname === href;

  return (
    <>
      <div className="navbarSticky">
        <nav className="navbarPrimario">
          <Container>
            <h1 className="logo">
              <Link className="logoLink" href="/">
                ELECTROSHOP
              </Link>
            </h1>

            <input
              type="text"
              placeholder="BUSCAR PRODUCTOS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search"
            />

            <div className="actions">
              <button className="icon-btn">
                <UserRound size={30} />
              </button>

              <div className="cartWrapper">
                <button className="icon-btn cart-btn" onClick={toggleCart}>
                  <ShoppingCartIcon size={30} />

                  {totalItems > 0 && (
                    <span className="badge">{totalItems}</span>
                  )}
                </button>

                <Cart />
              </div>
            </div>
          </Container>
        </nav>

        <div className="rgbbar"></div>
      </div>

      <nav className="navbarSecundario">
        <Container>
          <ul className="navbarLinks">
            <li>
              <Link
                href="/"
                className={`navbarLinkText ${isActive("/") ? "active" : ""}`}
              >
                INICIO
              </Link>
            </li>

            <li>
              <Link
                href="/category/gpu"
                className={`navbarLinkText ${
                  isActive("/category/gpu") ? "active" : ""
                }`}
              >
                GPU
              </Link>
            </li>

            <li>
              <Link
                href="/category/cpu"
                className={`navbarLinkText ${
                  isActive("/category/cpu") ? "active" : ""
                }`}
              >
                CPU
              </Link>
            </li>

            <li>
              <Link
                href="/category/ram"
                className={`navbarLinkText ${
                  isActive("/category/ram") ? "active" : ""
                }`}
              >
                RAM
              </Link>
            </li>

            <li>
              <Link
                href="/category/storage"
                className={`navbarLinkText ${
                  isActive("/category/storage") ? "active" : ""
                }`}
              >
                ALMACENAMIENTO
              </Link>
            </li>
          </ul>
        </Container>
      </nav>
    </>
  );
}
