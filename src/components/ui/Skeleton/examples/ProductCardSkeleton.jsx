"use client";

import Skeleton from "@/components/ui/Skeleton";

export default function ProductCardSkeleton({ className = "" }) {
  return (
    <div className={className} role="status" aria-label="Cargando producto">
      {/* Image area — square 1:1, matching ProductCard image dimensions */}
      <Skeleton width="100%" style={{ aspectRatio: "1/1" }} />

      {/* Meta lines — varying widths to hint at content structure without 1:1 copy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 10 }}>
        {/* Brand / Category — short line at 42% width */}
        <Skeleton width="42%" height={12} />

        {/* Title — 88% width for a natural text line appearance */}
        <Skeleton width="88%" height={15} />

        {/* Price — slightly taller and ~52% width */}
        <Skeleton width="52%" height={17} />
      </div>

      {/* Add-to-cart button — matches real button height */}
      <Skeleton width="100%" height={34} style={{ marginTop: 8 }} />
    </div>
  );
}

/*
 * Usage:
 *
 * import ProductCardSkeleton from "@/components/ui/Skeleton/examples/ProductCardSkeleton";
 *
 * // Inside a grid:
 * <ProductCardSkeleton className={styles.card} />
 */
