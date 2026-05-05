export function buildCategoryUrl(category, current, override) {
    const final = {
        sort: "",
        brand: "",
        min: "",
        max: "",
        view: "",
        ...current,
        ...override,
    };

    const searchParams = new URLSearchParams();

    if (final.sort && final.sort !== "recent") {
        searchParams.set("sort", final.sort);
    }

    if (final.brand) {
        searchParams.set("brand", final.brand);
    }

    if (final.min) {
        searchParams.set("min", final.min);
    }

    if (final.max) {
        searchParams.set("max", final.max);
    }

    if (final.view && final.view !== "grid") {
        searchParams.set("view", final.view);
    }

    return `/category/${category}?${searchParams.toString()}`;
}
