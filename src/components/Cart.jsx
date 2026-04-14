import "./Cart.css";
import { useId } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
export function Cart() {
  const cartCheckboxId = useId();
  const { cart, clearCart } = useCart();
  return (
    <>
      <label className="cart-button" htmlFor={cartCheckboxId}>
        <ShoppingCart className="w-6 h-6" />
      </label>
      <input id={cartCheckboxId} type="checkbox" hidden />
      <aside className="cart">
        <ul>
          {cart.map((product) => (
            <li key={product.id}>
              <Image
                src={product.thumbnail}
                alt={product.title}
                width="100"
                height="100"
              />
              <div>
                <strong>{product.title}</strong> - ${product.price}
              </div>
              <footer>
                <small>Qty: {product.quantity}</small>
                <button>+</button>
              </footer>
            </li>
          ))}
        </ul>
        <button onClick={() => clearCart()}>
          <Trash2 />
        </button>
      </aside>
    </>
  );
}
