// src/app/loading.jsx — Home page skeleton
// 1:1 DOM mirror of real components: HeroSlider → FeaturedCarousel → PromoBanner → BrandSection

import s from "./HomeSkeleton.module.css";

export default function Loading() {
  return (
    <main>
      {/* HeroSlider skeleton — full width, no max-width wrapper */}
      <section className={`${s.shimmer} ${s.slider}`}></section>

      {/* FeaturedCarousel skeleton */}
      <section className={s.section}>
        {/* SectionTitle "PRODUCTOS DESTACADOS" */}
        <div className={s.sectionTitle}>
          <div className={`${s.shimmer} ${s.sectionTitleBar}`}></div>
        </div>

        {/* fc-scroll row — matching FeaturedCarousel horizontal scroll */}
        <div className={s.featuredScroll} role="status" aria-label="Cargando productos destacados">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={s.fcCard}>
              <div className={`${s.shimmer} ${s.fcCardImg}`}></div>
              <div className={s.fcCardMeta}>
                <div className={`${s.shimmer} ${s.line} ${s.lineSm}`}></div>
                <div className={`${s.shimmer} ${s.line} ${s.lineMd}`}></div>
                <div className={`${s.shimmer} ${s.lineXs}`}></div>
              </div>
              <div className={`${s.shimmer} ${s.cardBtn}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* PromoBanner skeleton */}
      <section className={s.promo}>
        <div className={s.promoContainer}>
          <div className={s.promoFeatures}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.promoFeature}>
                <div className={`${s.shimmer} ${s.promoIcon}`}></div>
                <div className={s.promoText}>
                  <div className={`${s.shimmer} ${s.ptitle}`}></div>
                  <div className={`${s.shimmer} ${s.psub}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.promoCta}>
            <div className={s.promoCtaContent}>
              <div className={`${s.shimmer} ${s.ctaTitle}`}></div>
              <div className={`${s.shimmer} ${s.ctaSub}`}></div>
            </div>
            <div className={`${s.shimmer} ${s.promoCtaBtn}`}></div>
          </div>
        </div>
      </section>

      {/* BrandSection skeleton */}
      <section className={s.section}>
        {/* SectionTitle "MARCAS QUE TRABAJAMOS" */}
        <div className={s.sectionTitle}>
          <div className={`${s.shimmer} ${s.sectionTitleBar}`}></div>
        </div>

        <div className={s.brandsGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${s.shimmer} ${s.brandBox}`}></div>
          ))}
        </div>
      </section>
    </main>
  );
}
