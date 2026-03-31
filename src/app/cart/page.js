"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CartItem from "@/app/components/CartItem";

export default function Cart() {
    const { cart } = useContext(CartContext);

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
            </div>
        )
    } return <h2>No se han agregado productos.</h2>
}