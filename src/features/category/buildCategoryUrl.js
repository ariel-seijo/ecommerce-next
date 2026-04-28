export function buildCategoryUrl(
    name,
    current,
    changes = {}
) {
    const params =
        new URLSearchParams();

    const next = {
        ...current,
        ...changes,
    };

    Object.entries(next).forEach(
        ([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                value !== "recent"
            ) {
                params.set(key, value);
            }
        }
    );

    const query =
        params.toString();

    return query
        ? `/category/${name}?${query}`
        : `/category/${name}`;
}