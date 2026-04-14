import "./Cart.css";
import { useId } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Trash2 } from "lucide-react";
export function Cart() {
  const cartCheckboxId = useId();
  return (
    <>
      <label className="cart-button" htmlFor={cartCheckboxId}>
        <ShoppingCart className="w-6 h-6" />
      </label>
      <input id={cartCheckboxId} type="checkbox" hidden />
      <aside className="cart">
        <ul>
          <li>
            <Image
              src="https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp"
              alt=""
              width="100"
              height="100"
            />
            <div>
              <strong>Iphone</strong> - $1999
            </div>
            <footer>
              <small>Qty: 1</small>
              <button>+</button>
            </footer>
          </li>
        </ul>
        <button>
          <Trash2 />
        </button>
      </aside>
    </>
  );
}
