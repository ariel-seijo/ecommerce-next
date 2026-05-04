// src/app/loading.jsx

import "./globals.css";

export default function Loading() {
  return (
    <main className="homeLoading">
      {/* slider */}
      <section className="homeWrap">
        <div className="sk sk-slider"></div>
      </section>

      {/* destacados */}
      <section className="featured homeWrap">
        <div className="sk sk-section-title"></div>

        <div className="sk-fc" role="status" aria-label="Cargando productos destacados">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sk-fc-card">
              <div className="sk sk-fc-img"></div>
              <div className="sk sk-line sm"></div>
              <div className="sk sk-line md"></div>
              <div className="sk sk-line xs"></div>
              <div className="sk sk-buy"></div>
            </div>
          ))}
        </div>
      </section>

      {/* marcas */}
      <section className="brands homeWrap">
        <div className="sk sk-section-title"></div>

        <div className="sk-brands-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="sk sk-brand"></div>
          ))}
        </div>
      </section>
    </main>
  );
}
