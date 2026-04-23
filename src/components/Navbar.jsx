"use client";

import "./Navbar.css";
import Container from "@/components/Container";
import { useMemo, useState } from "react";
import { useCart } from "@/features/cart/useCart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon, UserRound } from "lucide-react";
import { Cart } from "@/features/cart/Cart";

export default function Navbar({ products = [] }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const { cart, toggleCart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (href) => pathname === href;

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return [];

    return products
      .filter((product) => product.title.toLowerCase().includes(term))
      .slice(0, 6);
  }, [search, products]);

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

            <div className="searchWrapper">
              <input
                type="text"
                placeholder="BUSCAR PRODUCTOS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />

              {search.trim() && (
                <div className="searchDropdown">
                  {results.length > 0 ? (
                    results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="searchItem"
                        onClick={() => setSearch("")}
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="searchThumb"
                        />

                        <div className="searchInfo">
                          <span className="searchTitle">{product.title}</span>

                          <span className="searchPrice">
                            ${product.price.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="searchEmpty">Sin resultados</div>
                  )}
                </div>
              )}
            </div>

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
