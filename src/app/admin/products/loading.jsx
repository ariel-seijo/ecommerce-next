import ProductTableSkeleton from "@/features/admin/components/ProductTableSkeleton";

export default function ProductsLoading() {
  return (
    <div>
      <h3 className="admin-card-title page-title-spacing">Productos</h3>
      <ProductTableSkeleton />
    </div>
  );
}
