import "./Brands.css";

const brands = [
  "Intel",
  "AMD",
  "NVIDIA",
  "ASUS",
  "MSI",
  "Gigabyte",
  "Corsair",
  "Samsung",
  "Kingston",
  "Logitech",
  "HyperX",
  "Razer",
  "Cooler Master",
  "Western Digital",
  "Seagate",
  "Acer",
];

export default function Brands() {
  return (
    <div className="brandsContainer">
      {brands.map((brand) => (
        <div className="brandBox" key={brand}>
          <h2>{brand.toUpperCase()}</h2>
        </div>
      ))}
    </div>
  );
}
