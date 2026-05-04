import "./PromoBanner.css";
import Link from "next/link";
import { ChevronRight, Zap, Truck, ShieldCheck } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="promo" aria-labelledby="promo-heading">
      <h2 id="promo-heading" className="visually-hidden">
        Beneficios de comprar con nosotros
      </h2>
      <div className="promo-container">
        <ul className="promo-features">
          <li className="promo-feature">
            <div className="feature-icon" aria-hidden="true">
              <Truck size={22} />
            </div>
            <div className="feature-text">
              <span className="feature-title">Envío gratis</span>
              <span className="feature-sub">En compras +$50.000</span>
            </div>
          </li>

          <li className="promo-feature">
            <div className="feature-icon" aria-hidden="true">
              <ShieldCheck size={22} />
            </div>
            <div className="feature-text">
              <span className="feature-title">Garantía oficial</span>
              <span className="feature-sub">12 meses en todos los productos</span>
            </div>
          </li>

          <li className="promo-feature">
            <div className="feature-icon" aria-hidden="true">
              <Zap size={22} />
            </div>
            <div className="feature-text">
              <span className="feature-title">Envío rápido</span>
              <span className="feature-sub">Despacho en 24hs hábiles</span>
            </div>
          </li>
        </ul>

        <div className="promo-cta">
          <div className="promo-cta-content">
            <h3>¿Listo para armar tu PC gamer?</h3>
            <p>
              Encontrá los mejores componentes con los precios más competitivos del mercado.
            </p>
          </div>

          <Link
            href="/category/gpu"
            className="promo-cta-btn"
            aria-label="Ver todos los componentes gaming"
          >
            Ver componentes
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
