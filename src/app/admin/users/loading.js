import UserTableSkeleton from "@/features/admin/components/users/UserTableSkeleton";

export default function UsersLoading() {
  return (
    <div>
      <h3 className="admin-card-title page-title-spacing">Usuarios</h3>
      <UserTableSkeleton />
    </div>
  );
}
