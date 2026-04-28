import Link from "next/link";

export default function CategoryHeader({ categoryName }) {
  return (
    <nav className="breadcrumbs">
      <Link href="/">Inicio</Link>

      <span>/</span>

      <span>{categoryName}</span>
    </nav>
  );
}
