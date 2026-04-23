// src/app/product/[slug]/loading.jsx

import "@/components/product/ProductPage.css";

export default function Loading() {
  return (
    <main className="product-page">
      {/* hero */}
      <section className="pp-hero">
        {/* izquierda imagen */}
        <div className="pp-gallery">
          <div className="sk sk-image"></div>

          <div className="pp-thumbs">
            <div className="sk sk-thumb"></div>
            <div className="sk sk-thumb"></div>
            <div className="sk sk-thumb"></div>
            <div className="sk sk-thumb"></div>
          </div>
        </div>

        {/* derecha info */}
        <div className="sk-wrap">
          <div className="sk sk-pill"></div>

          <div className="sk sk-line xl"></div>
          <div className="sk sk-line lg"></div>

          <div className="sk sk-line price"></div>

          <div className="sk sk-line md"></div>
          <div className="sk sk-line md"></div>
          <div className="sk sk-line sm"></div>

          <div className="pp-meta">
            <div className="sk sk-box"></div>
            <div className="sk sk-box"></div>
          </div>

          <div className="sk sk-btn"></div>
        </div>
      </section>

      {/* similares */}
      <section className="pp-related">
        <div className="sk sk-title"></div>

        <div className="pp-related-grid">
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
