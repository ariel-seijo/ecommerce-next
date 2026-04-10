import Image from "next/image";

export default function Products({ products }) {
  return (
    <main className="products">
      <ul>
        {products.slice(0, 10).map((product) => (
          <li key={product.id} className="card">
            <div className="img-container">
              <Image src={product.thumbnail} alt={product.title} fill />
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
