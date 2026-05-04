// Public API — products feature

export { default as ProductCard } from "./components/ProductCard";
export { default as Products } from "./components/Products";
export { default as FeaturedCarousel } from "./components/FeaturedCarousel";

export { default as ProductPage } from "./components/ProductPage";

export { getProductBySlug, getRelatedProducts } from "./api/product.service";
