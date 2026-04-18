"use client"

import { useContext } from "react";
import { FiltersContext } from "@/features/filters/FiltersContext";

export function useFilters() {
    const { filters, setFilters } = useContext(FiltersContext);

    const filterProducts = (products) => {
        return products.filter((product) => {
            return (
                product.price >= filters.minPrice &&
                (filters.category === "all" ||
                    product.category.name === filters.category)
            );
        });
    };

    return {
        filters,
        setFilters,
        filterProducts,
    };
}