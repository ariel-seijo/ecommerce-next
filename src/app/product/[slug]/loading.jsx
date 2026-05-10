import Skeleton from "@/components/ui/Skeleton";
import s from "@/features/products/styles/ProductSkeleton.module.css";

export default function Loading() {
  return (
    <main className={s.page}>
      {/* Breadcrumb */}
      <nav className={s.breadcrumb}>
        <Skeleton width={40} height={13} />
        <Skeleton width={80} height={13} />
        <Skeleton width={110} height={13} />
      </nav>

      {/* Hero: Gallery + Info */}
      <section className={s.hero}>
        {/* Gallery */}
        <div className={s.gallery}>
          <div className={s.mainImg}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className={s.thumbs}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={s.thumb}>
                <Skeleton width="100%" height="100%" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className={s.info}>
          {/* Tags */}
          <div className={s.tags}>
            <div className={`${s.tag} ${s.tagWide}`}>
              <Skeleton width="100%" height="100%" />
            </div>
            <div className={s.tag}>
              <Skeleton width="100%" height="100%" />
            </div>
            <div className={`${s.tag} ${s.tagWide}`}>
              <Skeleton width="100%" height="100%" />
            </div>
          </div>

          {/* Title */}
          <Skeleton width="85%" height={35} />

          {/* Rating */}
          <Skeleton width="45%" height={14} />

          {/* Price */}
          <Skeleton width="38%" height={35} />

          {/* Description */}
          <Skeleton width="88%" height={17} />
          <Skeleton width="88%" height={16} />
          <Skeleton width="56%" height={16} />

          {/* Meta boxes */}
          <div className={s.meta}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={s.metaBox}>
                <Skeleton width={18} height={18} />
                <div className={s.metaText}>
                  <Skeleton width="60%" height={11} />
                  <Skeleton width="82%" height={14} />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className={s.actions}>
            <div className={s.qty}>
              <Skeleton width="100%" height="100%" />
            </div>
            <Skeleton width="100%" height={52} style={{ flex: 1 }} />
          </div>

          {/* Features */}
          <div className={s.features}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className={s.featureItem}>
                <Skeleton width={16} height={16} />
                <Skeleton width="75%" height={13} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className={s.related}>
        <div className={s.relatedHeader}>
          <Skeleton width={260} height={21} />
          <Skeleton width={100} height={13} />
        </div>

        <div className={s.relatedGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={s.relatedCard}>
              <Skeleton width="100%" style={{ aspectRatio: "1/1" }} />
              <div className={s.relCardMeta}>
                <Skeleton width="42%" height={15} />
                <Skeleton width="88%" height={15} />
                <Skeleton width="52%" height={17} />
              </div>
              <Skeleton width="100%" height={34} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
