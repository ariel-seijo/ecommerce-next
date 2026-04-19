"use client";

import "./Navbar.css";
import Container from "@/components/Container";
import { useState } from "react";
import { useCart } from "@/features/cart/useCart";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, UserRound } from "lucide-react";
import { Cart } from "@/features/cart/Cart";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const { cart } = useCart();
  const { toggleCart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div className="navbarSticky">
        <nav className="navbarPrimario">
          <Container>
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
        <Container className="">
          <ul className="navbarLinks">
            <li>
              <Link className="navbarLinkText" href="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="navbarLinkText" href="/category/gpu">
                GPU
              </Link>
            </li>
            <li>
              <Link className="navbarLinkText" href="/category/cpu">
                CPU
              </Link>
            </li>
            <li className="navbarItem">
              <Link className="navbarLinkText" href="/category/ram">
                RAM
              </Link>
            </li>
            <li>
              <Link className="navbarLinkText" href="/category/storage">
                Almacenamiento
              </Link>
            </li>
          </ul>
        </Container>
      </nav>
    </>
  );
}
