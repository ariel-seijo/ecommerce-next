import Link from "next/link";
import { buildCategoryUrl } from "./buildCategoryUrl";

export default function SortDropdown({ name, sort, brand, min, max }) {
  const current = {
    sort,
    brand,
    min,
    max,
  };

  const options = [
    {
      label: "Más reciente",
      value: "recent",
    },
    {
      label: "Más vendido",
      value: "popular",
    },
    {
      label: "Mejor valorado",
      value: "rating",
    },
    {
      label: "Menor precio",
      value: "asc",
    },
    {
      label: "Mayor precio",
      value: "desc",
    },
  ];

  const currentLabel =
    options.find((item) => item.value === sort)?.label || "Más reciente";

  return (
    <div className="sortDropdown">
      <span className="sortLabel">Ordenar por:</span>

      <details>
        <summary>{currentLabel}</summary>

        <div className="sortMenu">
          {options.map((item) => (
            <Link
              key={item.value}
              href={buildCategoryUrl(name, current, {
                sort: item.value,
              })}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
