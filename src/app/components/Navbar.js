"use client"

import Link from "next/link"
import { Search, ShoppingCart, User } from "lucide-react"
import { useCart } from "../hooks/useCart"
import "./Navbar.css"
import Image from "next/image"

export default function Navbar() {
    const { totalItems } = useCart()
    return (
        <header className="navbar">
            <div className="navbar-top">
                <Link href="/" className="navbar-logo">
                    <Image alt="logo de Electroshop" src="/logo-eshop.png" width={150} height={150} className="electroshop"></Image>
                </Link>
                <div className="navbar-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                    />
                </div>
                <div className="navbar-icons">
                    <User className="navbar-icon" />
                    <Link href="/cart" className="navbar-icon cart-container">
                        <ShoppingCart />
                        {totalItems > 0 && (
                            <span className="cart-badge">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
            <div className="navbar-bottom">
                <Link href="/" className="navbar-link">
                    Productos
                </Link>
            </div>
        </header>
    )
}