import Image from "next/image";

export default function CartItem({ product }) {
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

      <p style={{ fontWeight: "bold" }}>${product.price}</p>
    </div>
  );
}
