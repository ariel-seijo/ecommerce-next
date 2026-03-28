import Image from "next/image";

export default function ProductCard({ product }) {
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

      <button
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
        Agregar al carrito
      </button>
    </div>
  );
}
