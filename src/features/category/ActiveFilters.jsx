import Link from "next/link";

export default function ActiveFilters({ name, sort, brand, price }) {
  const filters = [];

  if (sort && sort !== "recent") {
    const sortLabels = {
      asc: "Menor precio",
      desc: "Mayor precio",
      popular: "Más vendidos",
      rating: "Mejor valorados",
    };

    filters.push({
      label: sortLabels[sort],
      href: `/category/${name}?brand=${brand}&price=${price}`,
    });
  }

  if (brand) {
    filters.push({
      label: brand,
      href: `/category/${name}?sort=${sort}&price=${price}`,
    });
  }

  if (price) {
    const priceLabels = {
      1: "Hasta $100",
      2: "$100 - $300",
      3: "$300+",
    };

    filters.push({
      label: priceLabels[price],
      href: `/category/${name}?sort=${sort}&brand=${brand}`,
    });
  }

  if (filters.length === 0) return null;

  return (
    <div className="activeFilters">
      {filters.map((item) => (
        <Link key={item.label} href={item.href} className="filterChip">
          {item.label} ✕
        </Link>
      ))}
    </div>
  );
}
