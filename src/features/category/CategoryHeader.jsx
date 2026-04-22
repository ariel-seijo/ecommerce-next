import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

export default function CategoryHeader({ name, categoryName, totalProducts }) {
  return (
    <>
      {/* breadcrumbs */}
      <nav className="breadcrumbs">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>{categoryName}</span>
      </nav>

      {/* title */}
      <SectionTitle>{categoryName}</SectionTitle>

      {/* topbar */}
      <div className="categoryTopbar">
        <p>
          {totalProducts} producto
          {totalProducts !== 1 ? "s" : ""} encontrados
        </p>

        <Link href={`/category/${name}`} className="clearFilter">
          Limpiar filtros
        </Link>
      </div>
    </>
  );
}
