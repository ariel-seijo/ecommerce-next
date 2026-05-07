"use client";

import styles from "../styles/Navbar.module.css";
import Container from "@/components/Container";
import { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { useToastStore } from "@/features/toast";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCartIcon, UserRound, LogOut, Shield, LayoutDashboard, User, Package } from "lucide-react";
import { Cart } from "@/features/cart";

export default function Navbar({ products = [] }) {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { cart, toggleCart } = useCart();
  const { user, logout } = useAuthStore();
  const toast = useToastStore((s) => s.toast);

  const menuRef = useRef(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isAdmin = user?.role === "ADMIN";
  const displayName = user?.name || user?.email?.split("@")[0];

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
    toast("Sesión cerrada exitosamente", "success");
    router.push("/");
  };

  return (
    <>
      <div className={styles.navbarSticky}>
        <nav className={styles.navbarPrimario}>
          <Container>
            <h1 className={styles.logo}>
              <Link className={styles.logoLink} href="/">
                ELECTROSHOP
              </Link>
            </h1>

            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="BUSCAR PRODUCTOS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.search}
              />

              {search.trim() && (
                <div className={styles.searchDropdown}>
                  {results.length > 0 ? (
                    results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className={styles.searchItem}
                        onClick={() => setSearch("")}
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className={styles.searchThumb}
                        />

                        <div className={styles.searchInfo}>
                          <span className={styles.searchTitle}>{product.title}</span>

                          <span className={styles.searchPrice}>
                            ${product.price.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className={styles.searchEmpty}>Sin resultados</div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <div className={styles.userWrapper} ref={menuRef}>
                <button
                  className={styles["icon-btn"]}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <UserRound size={30} />
                  {isAdmin && <span className={styles.adminBadge}>ADMIN</span>}
                </button>

                {showUserMenu && (
                  <div className={`${styles.userDropdown} ${showUserMenu ? styles.open : ""}`}>
                    {user ? (
                      <>
                        <div className={styles.userDropdownHeader}>
                          <div className={styles.avatarCircle}>
                            {isAdmin ? <Shield size={18} /> : <User size={18} />}
                          </div>
                          <div className={styles.headerInfo}>
                            {isAdmin ? (
                              <span className={styles.adminLabel}>ADMIN</span>
                            ) : (
                              <span className={styles.customerLabel}>
                                cliente <span className={styles.customerName}>{displayName}</span>
                              </span>
                            )}
                            <span className={styles.userDropdownEmail}>{user.email}</span>
                          </div>
                        </div>
                        {isAdmin ? (
                          <>
                            <Link
                              href="/dashboard"
                              className={`${styles.userDropdownLink} ${styles.userDropdownAccent}`}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <LayoutDashboard size={15} />
                              Dashboard
                            </Link>
                            <Link
                              href="/admin"
                              className={styles.userDropdownLink}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield size={15} />
                              Panel admin
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/profile"
                              className={styles.userDropdownLink}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <User size={15} />
                              Mi perfil
                            </Link>
                            <Link
                              href="/orders"
                              className={styles.userDropdownLink}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Package size={15} />
                              Mis pedidos
                            </Link>
                          </>
                        )}
                        <div className={styles.userDropdownDivider} />
                        <button
                          onClick={handleLogout}
                          className={styles.userDropdownBtn}
                        >
                          <LogOut size={15} />
                          Salir
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className={styles.userDropdownLink}
                          onClick={() => setShowUserMenu(false)}
                        >
                          Iniciar Sesión
                        </Link>
                        <div className={styles.userDropdownDivider} />
                        <Link
                          href="/register"
                          className={styles.userDropdownLink}
                          onClick={() => setShowUserMenu(false)}
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.cartWrapper}>
                <button className={`${styles["icon-btn"]} ${styles["cart-btn"]}`} onClick={toggleCart}>
                  <ShoppingCartIcon size={30} />

                  {totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                  )}
                </button>

                <Cart />
              </div>
            </div>
          </Container>
        </nav>

        <div className={styles.rgbbar}></div>
      </div>

      <nav className={styles.navbarSecundario}>
        <Container>
          <ul className={styles.navbarLinks}>
            <li>
              <Link
                href="/"
                className={`${styles.navbarLinkText} ${isActive("/") ? styles.active : ""}`}
              >
                INICIO
              </Link>
            </li>

            <li>
              <Link
                href="/category/gpu"
                className={`${styles.navbarLinkText} ${
                  isActive("/category/gpu") ? styles.active : ""
                }`}
              >
                GPU
              </Link>
            </li>

            <li>
              <Link
                href="/category/cpu"
                className={`${styles.navbarLinkText} ${
                  isActive("/category/cpu") ? styles.active : ""
                }`}
              >
                CPU
              </Link>
            </li>

            <li>
              <Link
                href="/category/ram"
                className={`${styles.navbarLinkText} ${
                  isActive("/category/ram") ? styles.active : ""
                }`}
              >
                RAM
              </Link>
            </li>

            <li>
              <Link
                href="/category/storage"
                className={`${styles.navbarLinkText} ${
                  isActive("/category/storage") ? styles.active : ""
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
