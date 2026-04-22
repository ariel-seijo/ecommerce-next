export function buildCategoryUrl(name, currentFilters = {}, newValues = {}) {
    const params = new URLSearchParams();

    const finalSort =
        newValues.sort !== undefined
            ? newValues.sort
            : currentFilters.sort || "recent";

    const finalBrand =
        newValues.brand !== undefined
            ? newValues.brand
            : currentFilters.brand || "";

    const finalPrice =
        newValues.price !== undefined
            ? newValues.price
            : currentFilters.price || "";

    if (finalSort) params.set("sort", finalSort);
    if (finalBrand) params.set("brand", finalBrand);
    if (finalPrice) params.set("price", finalPrice);

    return `/category/${name}?${params.toString()}`;
}