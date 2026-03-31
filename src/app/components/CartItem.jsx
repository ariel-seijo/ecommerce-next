import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CartItem({ product }) {
  const { increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const { removeFromCart } = useContext(CartContext);
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        padding: "10px",
        transition: "0.2s",
      }}
    >
      <Image
        src={product.image}
        alt={product.title}
        width={200}
        height={200}
        style={{ borderRadius: "10px" }}
      />

      <h3>{product.title}</h3>
      <button
        onClick={() => {
          removeFromCart(product.id);
        }}
        style={{
          width: "100%",
          padding: "8px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Eliminar
      </button>
      <p style={{ fontWeight: "bold" }}>${product.price}</p>
      <button onClick={() => decreaseQuantity(product.id)}>-</button>

      <span>{product.quantity}</span>

      <button onClick={() => increaseQuantity(product.id)}>+</button>
    </div>
  );
}
