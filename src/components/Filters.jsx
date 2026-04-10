import "./Filters.css";
import { useState } from "react";
export default function Filters({ onChange }) {
  const [minPrice, setMinPrice] = useState(0);

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    onChange((prev) => ({ ...prev, minPrice: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    onChange((prev) => ({ ...prev, category: e.target.value }));
  };
  return (
    <section className="filters">
      <div>
        <label htmlFor="category">Categorias</label>
        <select name="category" id="category" onChange={handleCategoryChange}>
          <option value="all">Todas</option>
          <option value="groceries">Comestibles</option>
          <option value="beauty">Belleza</option>
        </select>
      </div>

      <div>
        <label htmlFor="price">Precio mínimo: </label>
        <input
          type="range"
          name="price"
          id="price"
          value={minPrice}
          min="0"
          max="100"
          onChange={handleMinPriceChange}
        />
        <span>${minPrice}</span>
      </div>
    </section>
  );
}
