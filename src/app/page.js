"use client";

import '../components/Products.css'
import Products from '../components/Products';
import Header from '../components/Header';
import { products as initialProducts } from '../mocks/products';
import { useFilters } from '../hooks/useFilters';


export default function Home() {
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(initialProducts)
  return (
    <>
      <Header />
      <Products products={filteredProducts} />
    </>
  );
}