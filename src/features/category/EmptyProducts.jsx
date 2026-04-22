import Link from "next/link";

export default function EmptyProducts({ name }) {
  return (
    <div className="emptyState">
      <h3>No encontramos productos</h3>

      <p>Probá cambiando los filtros o limpiando la búsqueda actual.</p>

      <Link href={`/category/${name}`} className="emptyBtn">
        Ver todos los productos
      </Link>
    </div>
  );
}
