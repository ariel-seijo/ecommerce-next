import ProductTableSkeleton from "@/features/admin/components/ProductTableSkeleton";

export default function ProductsLoading() {
  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Productos</h3>
        </div>
        <ProductTableSkeleton />
      </div>
    </div>
  );
}
