"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import ProductSearch from "./ProductSearch";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";

export default function ProductsClient({
  products,
  total,
  page,
  totalPages,
  categories,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "";
  const featured = searchParams.get("featured") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const pushParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/admin/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  function handleFilter(key, value) {
    pushParams({ [key]: value, page: "" });
  }

  function handleSort(field) {
    if (sort === field) {
      pushParams({ order: order === "asc" ? "desc" : "asc" });
    } else {
      pushParams({ sort: field, order: "asc" });
    }
  }

  function handlePage(newPage) {
    pushParams({ page: String(newPage) });
  }

  return (
    <>
      <ProductSearch />
      <ProductFilters
        categories={categories}
        categoryId={categoryId}
        status={status}
        featured={featured}
        sort={sort}
        order={order}
        onChange={handleFilter}
      />
      <ProductTable
        products={products}
        total={total}
        page={page}
        totalPages={totalPages}
        sort={sort}
        order={order}
        onSort={handleSort}
        onPage={handlePage}
      />
    </>
  );
}
