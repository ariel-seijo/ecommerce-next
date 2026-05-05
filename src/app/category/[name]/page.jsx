import "./category.css";

import { Products } from "@/features/products";
import {
  getCategoryProducts,
  FiltersSidebar,
  CategoryHeader,
  EmptyProducts,
  SortDropdown,
  ViewSwitcher,
  ViewHydrator,
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

  const view = query.view || "grid";

  return (
    <main className="categoryPage">
      <ViewHydrator />
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
            view={view}
          />

          <section className="productsArea">
            <div className="resultsTopbar">
              <CategoryHeader categoryName={categoryName} />

              <div className="toolbarRight">
                <ViewSwitcher />
                <SortDropdown
                  name={name}
                  sort={sort}
                  brand={brand}
                  min={min}
                  max={max}
                  view={view}
                />
              </div>
            </div>

            {products.length > 0 ? (
              <Products products={products} view={view} />
            ) : (
              <EmptyProducts name={name} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
