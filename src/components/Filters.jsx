import "./Filters.css";
import { useState } from "react";
export default function Filters() {
  const [minPrice, setMinPrice] = useState(0);

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  return (
    <section className="filters">
      <div>
        <label htmlFor="category">Categorias</label>
        <select name="category" id="category">
          <option value="all">Todas</option>
          <option value="groceries">Comestibles</option>
          <option value="beauty">Belleza</option>
        </select>
      </div>

      <div>
        <label htmlFor="price">Precio</label>
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
