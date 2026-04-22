import "./category.css";

import ProductsWrapper from "@/features/products/ProductsWrapper";

import { getCategoryProducts } from "@/features/category/getCategoryProducts";

import FiltersSidebar from "@/features/category/FiltersSidebar";
import CategoryHeader from "@/features/category/CategoryHeader";
import ActiveFilters from "@/features/category/ActiveFilters";
import EmptyProducts from "@/features/category/EmptyProducts";

export default async function CategoryPage({ params, searchParams }) {
  const { name } = await params;
  const query = await searchParams;

  const categoryName = name.toUpperCase();

  const sort = query.sort || "recent";
  const brand = query.brand || "";
  const price = query.price || "";

  const { products, brands } = await getCategoryProducts({
    categoryName,
    sort,
    brand,
    price,
  });

  return (
    <main className="categoryPage">
      <div className="categoryContainer">
        <CategoryHeader
          name={name}
          categoryName={categoryName}
          totalProducts={products.length}
        />

        <ActiveFilters name={name} sort={sort} brand={brand} price={price} />

        <div className="categoryContent">
          <FiltersSidebar
            name={name}
            brands={brands}
            sort={sort}
            brand={brand}
            price={price}
          />

          <section className="productsArea">
            {products.length > 0 ? (
              <ProductsWrapper products={products} />
            ) : (
              <EmptyProducts name={name} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
