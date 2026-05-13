import UserTableSkeleton from "@/features/admin/components/users/UserTableSkeleton";

export default function UsersLoading() {
  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Usuarios</h3>
        </div>
        <UserTableSkeleton />
      </div>
    </div>
  );
}
