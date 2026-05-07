// src/app/category/[name]/loading.jsx — Category page skeleton
// 1:1 DOM mirror of real layout: Breadcrumb → Topbar → Chips → Content( Sidebar + Products )

import s from "@/features/category/styles/CategorySkeleton.module.css";

export default function Loading() {
  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Breadcrumb — matches CategoryHeader breadcrumbs */}
        <div className={s.breadcrumbRow}>
          <div className={`${s.shimmer} ${s.breadItem} ${s.breadXs}`}></div>
          <div className={`${s.shimmer} ${s.breadItem} ${s.breadSm}`}></div>
        </div>

        {/* Topbar — matches resultsTopbar */}
        <div className={s.topbar}>
          {/* Left: breadcrumb title */}
          <div className={s.topbarBread}>
            <div className={`${s.shimmer} ${s.topbarTitle}`}></div>
          </div>

          {/* Right: ViewSwitcher + SortDropdown */}
          <div className={s.toolbarRight}>
            <div className={s.viewToggle}>
              <div className={`${s.shimmer} ${s.toggleBtn}`}></div>
              <div className={`${s.shimmer} ${s.toggleBtn}`}></div>
            </div>
            <div className={`${s.shimmer} ${s.sortBtn}`}></div>
          </div>
        </div>

        {/* Active filter chips — matches activeFilters */}
        <div className={s.chips}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${s.shimmer} ${s.chip}`}></div>
          ))}
        </div>

        {/* Content — matches categoryContent grid */}
        <div className={s.content}>
          {/* Sidebar — matches .filters */}
          <aside className={s.sidebar}>
            {/* Filter group: Seleccionados */}
            <div className={s.filterGroup}>
              <div className={`${s.shimmer} ${s.filterTitle}`}></div>
              <div className={`${s.shimmer} ${s.selectedChip}`}></div>
              <div className={`${s.shimmer} ${s.selectedChip}`}></div>
              <div className={`${s.shimmer} ${s.selectedChip}`} style={{ width: 130 }}></div>
            </div>

            {/* Filter group: Precio (range) */}
            <div className={s.filterGroup}>
              <div className={`${s.shimmer} ${s.filterTitle}`}></div>
              <div className={s.rangeRow}>
                <div className={`${s.shimmer} ${s.rangeLabel}`}></div>
                <div className={`${s.shimmer} ${s.rangeLabel}`}></div>
              </div>
              <div className={`${s.shimmer} ${s.rangeBar}`}></div>
              <div className={`${s.shimmer} ${s.rangeBtn}`}></div>
            </div>

            {/* Filter group: Marca */}
            <div className={s.filterGroup}>
              <div className={`${s.shimmer} ${s.filterTitle}`}></div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`${s.shimmer} ${s.filterOption}`}></div>
              ))}
            </div>
          </aside>

          {/* Products area — matches productsArea */}
          <section className={s.productsArea} role="status" aria-label="Cargando productos">
            <div className={s.productsGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={s.productCard}>
                  <div className={`${s.shimmer} ${s.pcImg}`}></div>
                  <div className={s.pcMeta}>
                    <div className={`${s.shimmer} ${s.line} ${s.lineSm}`}></div>
                    <div className={`${s.shimmer} ${s.line} ${s.lineMd}`}></div>
                    <div className={`${s.shimmer} ${s.lineXs}`}></div>
                  </div>
                  <div className={`${s.shimmer} ${s.pcBtn}`}></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
