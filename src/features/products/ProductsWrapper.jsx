"use client";

import { useFilters } from "@/features/filters/useFilters";
import Products from "@/features/products/Products";

export default function ProductsWrapper({ products }) {
  const { filterProducts } = useFilters();

  const filteredProducts = filterProducts(products);

  return <Products products={filteredProducts} />;
}
