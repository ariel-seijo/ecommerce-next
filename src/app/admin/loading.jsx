import Skeleton from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div>
      <div className="admin-stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="admin-stat-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Skeleton width="60%" height={14} />
              <Skeleton width={20} height={20} variant="circle" />
            </div>
            <Skeleton width="80%" height={28} />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <Skeleton width="40%" height={16} />
        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
          <Skeleton width={200} height={40} />
          <Skeleton width={200} height={40} />
          <Skeleton width={200} height={40} />
        </div>
      </div>
    </div>
  );
}
