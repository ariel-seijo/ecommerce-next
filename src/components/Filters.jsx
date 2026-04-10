import "./Filters.css";
import { useState, useId } from "react";
export default function Filters({ onChange }) {
  const [minPrice, setMinPrice] = useState(0);
  const [priceFilterId] = useId();
  const [categoryFilterId] = useId();

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles changes to the minimum price filter.
   * Updates the local state with the new minimum price
   * and calls the onChange callback with the updated filter object.
   * @param {Event} e The event object from the input range change event.
   */
  /*******  35ad29f7-0e07-45cd-8053-ba5f031a918d  *******/
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
        <select
          name="category"
          id={categoryFilterId}
          onChange={handleCategoryChange}
        >
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
          id={priceFilterId}
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
