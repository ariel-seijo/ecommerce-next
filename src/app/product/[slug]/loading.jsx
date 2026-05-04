// src/app/product/[slug]/loading.jsx

import styles from "@/features/products/styles/ProductPage.module.css";

export default function Loading() {
  return (
    <main className={styles["product-page"]}>
      <section className={styles["pp-hero"]}>
        <div className={styles["pp-gallery"]}>
          <div className="sk sk-image"></div>

          <div className={styles["pp-thumbs"]}>
            <div className="sk sk-thumb"></div>
            <div className="sk sk-thumb"></div>
            <div className="sk sk-thumb"></div>
            <div className="sk sk-thumb"></div>
          </div>
        </div>

        <div className="sk-wrap">
          <div className="sk sk-pill"></div>

          <div className="sk sk-line xl"></div>
          <div className="sk sk-line lg"></div>

          <div className="sk sk-line price"></div>

          <div className="sk sk-line md"></div>
          <div className="sk sk-line md"></div>
          <div className="sk sk-line sm"></div>

          <div className={styles["pp-meta"]}>
            <div className="sk sk-box"></div>
            <div className="sk sk-box"></div>
          </div>

          <div className="sk sk-btn"></div>
        </div>
      </section>

      <section className={styles["pp-related"]}>
        <div className="sk sk-title"></div>

        <div className={styles["pp-related-grid"]}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sk-card">
              <div className="sk sk-card-img"></div>

              <div className="sk sk-line sm"></div>
              <div className="sk sk-line md"></div>
              <div className="sk sk-line xs"></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
