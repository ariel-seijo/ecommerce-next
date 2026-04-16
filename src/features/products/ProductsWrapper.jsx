"use client";

import { useFilters } from "../filters/useFilters";
import Products from "./Products";

export default function ProductsWrapper({ products }) {
  const { filterProducts } = useFilters();

  const filteredProducts = filterProducts(products);

  return <Products products={filteredProducts} />;
}
