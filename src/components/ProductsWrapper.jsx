"use client";

import { useFilters } from "@/hooks/useFilters";
import Products from "@/components/Products";

export default function ProductsWrapper({ products }) {
  const { filterProducts } = useFilters();

  const filteredProducts = filterProducts(products);

  return <Products products={filteredProducts} />;
}
