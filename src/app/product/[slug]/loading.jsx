// src/app/product/[slug]/loading.jsx — Product detail skeleton
// 1:1 DOM mirror of ProductPage: Breadcrumb → Hero( Gallery + Info ) → Related products

import s from "@/features/products/styles/ProductSkeleton.module.css";

export default function Loading() {
  return (
    <main className={s.page}>
      {/* Breadcrumb — matches pp-breadcrumb */}
      <nav className={s.breadcrumb}>
        <div className={`${s.shimmer} ${s.breadLink} ${s.breadXs}`}></div>
        <div className={`${s.shimmer} ${s.breadLink} ${s.breadSm}`}></div>
        <div className={`${s.shimmer} ${s.breadLink} ${s.breadMd}`}></div>
      </nav>

      {/* Hero — matches pp-hero grid */}
      <section className={s.hero}>
        {/* Gallery — matches pp-gallery */}
        <div className={s.gallery}>
          <div className={s.mainImg}>
            <div className={s.shimmer} style={{ width: "100%", height: "100%" }}></div>
          </div>

          <div className={s.thumbs}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${s.shimmer} ${s.thumb}`}></div>
            ))}
          </div>
        </div>

        {/* Info — matches pp-info */}
        <div className={s.info}>
          {/* Tags — matches pp-tags */}
          <div className={s.tags}>
            <div className={`${s.shimmer} ${s.tag} ${s.tagWide}`}></div>
            <div className={`${s.shimmer} ${s.tag}`}></div>
            <div className={`${s.shimmer} ${s.tag} ${s.tagWide}`}></div>
          </div>

          {/* Title — matches pp-title */}
          <div className={`${s.shimmer} ${s.title}`}></div>

          {/* Rating — matches pp-rating */}
          <div className={`${s.shimmer} ${s.rating}`}></div>

          {/* Price — matches pp-price-box */}
          <div className={`${s.shimmer} ${s.price}`}></div>

          {/* Description — matches pp-description */}
          <div className={`${s.shimmer} ${s.descLineLg} ${s.lineMd}`} style={{ height: 17 }}></div>
          <div className={`${s.shimmer} ${s.descLine} ${s.lineMd}`}></div>
          <div className={`${s.shimmer} ${s.descLine} ${s.descSm}`}></div>

          {/* Meta boxes — matches pp-meta grid */}
          <div className={s.meta}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={s.metaBox}>
                <div className={`${s.shimmer} ${s.metaIcon}`}></div>
                <div className={s.metaText}>
                  <div className={`${s.shimmer} ${s.metaLabel}`}></div>
                  <div className={`${s.shimmer} ${s.metaValue}`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions — matches pp-actions */}
          <div className={s.actions}>
            <div className={`${s.shimmer} ${s.qty}`}></div>
            <div className={`${s.shimmer} ${s.btnAdd}`}></div>
          </div>

          {/* Features — matches pp-features */}
          <div className={s.features}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className={s.featureItem}>
                <div className={`${s.shimmer} ${s.featureIcon}`}></div>
                <div className={`${s.shimmer} ${s.featureText}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products — matches pp-related */}
      <section className={s.related}>
        <div className={s.relatedHeader}>
          <div className={`${s.shimmer} ${s.relatedTitle}`}></div>
          <div className={`${s.shimmer} ${s.relatedLink}`}></div>
        </div>

        <div className={s.relatedGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={s.relatedCard}>
              <div className={`${s.shimmer} ${s.relCardImg}`}></div>
              <div className={s.relCardMeta}>
                <div className={`${s.shimmer} ${s.line} ${s.lineSm}`}></div>
                <div className={`${s.shimmer} ${s.line} ${s.lineMd}`}></div>
                <div className={`${s.shimmer} ${s.lineXs}`}></div>
              </div>
              <div className={`${s.shimmer} ${s.relCardBtn}`}></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
