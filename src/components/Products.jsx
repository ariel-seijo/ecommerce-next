import Image from "next/image";

export default function Products({ products }) {
  return (
    <main className="products">
      <ul>
        {products.slice(0, 10).map((product) => (
          <li key={product.id} className="card">
            <div className="img-container">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1200px) 25vw, 200px"
                priority={product.id <= 2}
              />
            </div>

            <div className="info">
              <h3>{product.title}</h3>
              <span className="price">${product.price}</span>
            </div>

            <button className="buy-btn">Comprar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
