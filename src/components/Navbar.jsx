"use client";

import "./Navbar.css";
import Container from "@/components/Container";
import { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/features/cart/useCart";
import { useAuthStore } from "@/features/auth/useAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCartIcon, UserRound, LogOut, Shield } from "lucide-react";
import { Cart } from "@/features/cart/Cart";

export default function Navbar({ products = [] }) {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { cart, toggleCart } = useCart();
  const { user, logout } = useAuthStore();

  const menuRef = useRef(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (href) => pathname === href;

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return [];

    return products
      .filter((product) => product.title.toLowerCase().includes(term))
      .slice(0, 6);
  }, [search, products]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push("/");
  };

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
              <div className="userWrapper" ref={menuRef}>
                <button
                  className="icon-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <UserRound size={30} />
                </button>

                {showUserMenu && (
                  <div className={`userDropdown ${showUserMenu ? "open" : ""}`}>
                    {user ? (
                      <>
                        <div className="userDropdownHeader">
                          <span className="userDropdownEmailLabel">
                            Signed in as
                          </span>
                          <span className="userDropdownEmail">{user.email}</span>
                        </div>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            className="userDropdownLink userDropdownAdminLink"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Shield size={16} />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/account"
                          className="userDropdownLink"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="userDropdownBtn"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="userDropdownLink"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          className="userDropdownLink"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

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
