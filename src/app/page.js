"use client";

import '../components/Products.css'
import Products from '../components/Products';
import Header from '../components/Header';
import { products as initialProducts } from '../mocks/products';
import { useFilters } from '../hooks/useFilters';
import { Cart } from '../components/Cart';
import { CartProvider } from '@/context/CartContext';

export default function Home() {
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(initialProducts)
  return (
    <CartProvider>
      <Header />
      <Cart />
      <Products products={filteredProducts} />
    </CartProvider>
  );
}