import "./category.css";

import { cookies } from "next/headers";

import { Products, Pagination } from "@/features/products";
import {
  getCategoryProducts,
  FiltersSidebar,
  CategoryHeader,
  EmptyProducts,
  SortDropdown,
  ViewSwitcher,
} from "@/features/category";
import { serializeProductsForClient } from "@/lib/utils/serialize-product";

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const displayName = truncate(name.toUpperCase(), 23);
  return {
    title: `${displayName} - Componentes | ElectroShop`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { name } = await params;
  const query = await searchParams;

  const categoryName = name.toUpperCase();

  const sort = query.sort || "recent";

  const brand = query.brand || "";

  const min = query.min || "";

  const max = query.max || "";

  const page = query.page || "1";

  const { products, brands, minPrice, maxPrice, page: currentPage, totalPages } = await getCategoryProducts({
    categoryName,
    sort,
    brand,
    min,
    max,
    page,
  });

  const cookieStore = await cookies();
  const cookieView = cookieStore.get("productView")?.value;

  const view = query.view || cookieView || "grid";

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
            view={view}
          />

          <section className="productsArea">
            <div className="resultsTopbar">
              <CategoryHeader categoryName={categoryName} />

              <div className="toolbarRight">
                <ViewSwitcher resolvedView={view} />
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
              <>
                <Products products={serializeProductsForClient(products)} view={view} />
                <Pagination
                  name={name}
                  page={currentPage}
                  totalPages={totalPages}
                  sort={sort}
                  brand={brand}
                  min={min}
                  max={max}
                  view={view}
                />
              </>
            ) : (
              <EmptyProducts name={name} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
