"use client";

import '../components/Products.css'
import Products from '../components/Products';
import Header from '../components/Header';
import { products as initialProducts } from '../mocks/products';
import { useState } from 'react';
import { useFilters } from '../hooks/useFilters';


export default function Home() {
  const { filterProducts } = useFilters();
  const [products] = useState(initialProducts)
  const filteredProducts = filterProducts(products)
  return (
    <>
      <Header />
      <Products products={filteredProducts} />
    </>
  );
}