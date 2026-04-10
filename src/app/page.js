"use client";

import '../components/Products.css'
import Products from '../components/Products';
import Header from '../components/Header';
import { products as initialProducts } from '../mocks/products';
import { useState } from 'react';
export default function Home() {
  const [products] = useState(initialProducts)
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0
  });

  const filterProducts = (products) => {
    return products.filter((product) => {
      return (
        product.price >= filters.minPrice &&
        (filters.category === 'all' || product.category === filters.category)
      )
    })
  }

  const filteredProducts = filterProducts(products)


  return (
    <>
      <Header />  
      <Products products={filteredProducts} />
    </>
  );
}