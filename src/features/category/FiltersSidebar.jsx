import Link from "next/link";
import { buildCategoryUrl } from "./buildCategoryUrl";

export default function FiltersSidebar({ name, brands, sort, brand, price }) {
  const current = { sort, brand, price };

  const isSort = (value) => sort === value;
  const isBrand = (value) => brand === value;
  const isPrice = (value) => price === value;

  return (
    <aside className="filters">
      {/* ORDENAR */}
      <div className="filterGroup">
        <span className="filterTitle">Ordenar</span>

        <Link
          href={buildCategoryUrl(name, current, { sort: "recent" })}
          className={isSort("recent") ? "active" : ""}
        >
          Más recientes
        </Link>

        <Link
          href={buildCategoryUrl(name, current, { sort: "popular" })}
          className={isSort("popular") ? "active" : ""}
        >
          Más vendidos
        </Link>

        <Link
          href={buildCategoryUrl(name, current, { sort: "rating" })}
          className={isSort("rating") ? "active" : ""}
        >
          Mejor valorados
        </Link>

        <Link
          href={buildCategoryUrl(name, current, { sort: "asc" })}
          className={isSort("asc") ? "active" : ""}
        >
          Menor precio
        </Link>

        <Link
          href={buildCategoryUrl(name, current, { sort: "desc" })}
          className={isSort("desc") ? "active" : ""}
        >
          Mayor precio
        </Link>
      </div>

      {/* PRECIO */}
      <div className="filterGroup">
        <span className="filterTitle">Precio</span>

        <Link
          href={buildCategoryUrl(name, current, { price: "1" })}
          className={isPrice("1") ? "active" : ""}
        >
          Hasta $100
        </Link>

        <Link
          href={buildCategoryUrl(name, current, { price: "2" })}
          className={isPrice("2") ? "active" : ""}
        >
          $100 - $300
        </Link>

        <Link
          href={buildCategoryUrl(name, current, { price: "3" })}
          className={isPrice("3") ? "active" : ""}
        >
          $300+
        </Link>
      </div>

      {/* MARCA */}
      <div className="filterGroup">
        <span className="filterTitle">Marca</span>

        {brands.map((item) => (
          <Link
            key={item.brand}
            href={buildCategoryUrl(name, current, {
              brand: item.brand,
            })}
            className={isBrand(item.brand) ? "active" : ""}
          >
            {item.brand}
          </Link>
        ))}
      </div>
    </aside>
  );
}
