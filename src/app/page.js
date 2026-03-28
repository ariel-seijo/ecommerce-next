import { products } from "@/data/products";
import ProductCard from "@/app/components/ProductCard";

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Mi Ecommerce</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}