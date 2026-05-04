"use client";

import { useState } from "react";
import Link from "next/link";
import { buildCategoryUrl } from "../utils/buildCategoryUrl";

export default function FiltersSidebar({
  name,
  brands,
  sort,
  brand,
  min,
  max,
  minPrice,
  maxPrice,
}) {
  const current = {
    sort,
    brand,
    min,
    max,
  };

  const [rangeValue, setRangeValue] = useState(Number(max || maxPrice));

  const sortLabels = {
    asc: "Menor precio",
    desc: "Mayor precio",
    popular: "Más vendidos",
    rating: "Mejor valorados",
  };

  return (
    <aside className="filters">
      <div className="filterGroup">
        <span className="filterTitle">Seleccionados</span>

        <div className="selectedArea">
          {sort !== "recent" && (
            <Link
              href={buildCategoryUrl(name, current, { sort: "recent" })}
              className="selectedTag"
            >
              {sortLabels[sort]} ✕
            </Link>
          )}

          {brand && (
            <Link
              href={buildCategoryUrl(name, current, { brand: "" })}
              className="selectedTag"
            >
              {brand} ✕
            </Link>
          )}

          {(min || max) && (
            <Link
              href={buildCategoryUrl(name, current, {
                min: "",
                max: "",
              })}
              className="selectedTag"
            >
              ${min || minPrice} - ${max || maxPrice} ✕
            </Link>
          )}

          {!brand && sort === "recent" && !min && !max && (
            <span className="noneSelected">Sin filtros</span>
          )}
        </div>
      </div>

      <div className="filterGroup">
        <span className="filterTitle">Precio</span>

        <form action={`/category/${name}`} method="GET" className="priceForm">
          <input type="hidden" name="sort" value={sort} />

          <input type="hidden" name="brand" value={brand} />

          <input type="hidden" name="min" value={minPrice} />

          <div className="rangeInfo">
            <small>Mín: ${minPrice}</small>
            <small>Max: ${rangeValue}</small>
          </div>

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={rangeValue}
            name="max"
            className="rangeBar"
            onChange={(e) => setRangeValue(Number(e.target.value))}
          />

          <button type="submit">Aplicar</button>
        </form>
      </div>

      <div className="filterGroup">
        <span className="filterTitle">Marca</span>

        {brands.map((item) => (
          <Link
            key={item.brand}
            href={buildCategoryUrl(name, current, {
              brand: item.brand,
            })}
            className={brand === item.brand ? "active" : ""}
          >
            {item.brand}
          </Link>
        ))}
      </div>
    </aside>
  );
}
