// src/app/category/[name]/loading.jsx

import "./category.css";

export default function Loading() {
  return (
    <main className="categoryPage">
      <div className="categoryContainer">
        {/* breadcrumb */}
        <div className="sk-row mb12">
          <div className="sk sk-bread w80"></div>
          <div className="sk sk-bread w120"></div>
          <div className="sk sk-bread w140"></div>
        </div>

        {/* topbar */}
        <div className="categoryTopbar">
          <div className="sk sk-title"></div>
          <div className="sk sk-btn-lite"></div>
        </div>

        {/* chips */}
        <div className="activeFilters">
          <div className="sk sk-chip"></div>
          <div className="sk sk-chip"></div>
          <div className="sk sk-chip"></div>
        </div>

        {/* content */}
        <div className="categoryContent">
          {/* sidebar */}
          <aside className="filters">
            <div className="filterGroup">
              <div className="sk sk-small-title"></div>

              <div className="sk sk-filter"></div>
              <div className="sk sk-filter"></div>
              <div className="sk sk-filter"></div>
            </div>

            <div className="filterGroup">
              <div className="sk sk-small-title"></div>

              <div className="sk sk-filter"></div>
              <div className="sk sk-filter"></div>
              <div className="sk sk-filter"></div>
            </div>

            <div className="filterGroup">
              <div className="sk sk-small-title"></div>

              <div className="sk sk-filter"></div>
              <div className="sk sk-filter"></div>
            </div>
          </aside>

          {/* products */}
          <section className="productsArea">
            <div className="sk-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sk-card">
                  <div className="sk sk-card-img"></div>

                  <div className="sk sk-line sm"></div>
                  <div className="sk sk-line md"></div>
                  <div className="sk sk-line xs"></div>

                  <div className="sk sk-cart-btn"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
