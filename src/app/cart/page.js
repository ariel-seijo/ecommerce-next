"use client";

import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import CartItem from "@/app/components/CartItem";

export default function Cart() {
    const { cart, clearCart } = useContext(CartContext);
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null // ⛔ evita mismatch

    const total = cart.reduce((acc, product) => {
        return acc + product.price * product.quantity;
    }, 0);

    if (cart.length > 0) {
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {cart.map((product) => (
                    <CartItem key={product.id} product={product} />
                ))}
                <h2>Total: ${total.toFixed(2)}</h2>
                <button onClick={clearCart}>Vaciar carrito</button>
            </div>

        )
    } return <h2>No se han agregado productos.</h2>
}