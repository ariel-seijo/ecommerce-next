import "./category.css";

import { Products } from "@/features/products";
import {
  getCategoryProducts,
  FiltersSidebar,
  CategoryHeader,
  EmptyProducts,
  SortDropdown,
} from "@/features/category";

export default async function CategoryPage({ params, searchParams }) {
  const { name } = await params;
  const query = await searchParams;

  const categoryName = name.toUpperCase();

  const sort = query.sort || "recent";

  const brand = query.brand || "";

  const min = query.min || "";

  const max = query.max || "";

  const { products, brands, minPrice, maxPrice } = await getCategoryProducts({
    categoryName,
    sort,
    brand,
    min,
    max,
  });

  return (
    <main className="categoryPage">
      <div className="categoryContainer">
        <div className="categoryContent">
          <FiltersSidebar
            name={name}
            brands={brands}
            sort={sort}
            brand={brand}
            min={min}
            max={max}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          <section className="productsArea">
            <div className="resultsTopbar">
              <CategoryHeader categoryName={categoryName} />

              <SortDropdown
                name={name}
                sort={sort}
                brand={brand}
                min={min}
                max={max}
              />
            </div>

            {products.length > 0 ? (
              <Products products={products} />
            ) : (
              <EmptyProducts name={name} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
