"use client";

import Skeleton from "@/components/ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} role="status" aria-label="Cargando perfil">
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          minWidth: 260,
          background: "rgb(22,22,22)",
          borderRight: "1px solid rgb(38,38,38)",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 0",
        }}
      >
        {/* User avatar + name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "0 1.5rem 2rem",
            borderBottom: "1px solid rgb(38,38,38)",
            marginBottom: "1.5rem",
          }}
        >
          <Skeleton variant="circle" width={80} height={80} />
          <Skeleton width="60%" height={16} />
          <Skeleton width="72%" height={13} />
        </div>

        {/* Nav links */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "0 0.75rem",
            flex: 1,
          }}
        >
          <Skeleton width="90%" height={48} />
          <Skeleton width="85%" height={48} />
          <Skeleton width="70%" height={48} style={{ marginTop: "auto" }} />
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "2rem", background: "rgb(18,18,18)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {/* Card: Account Info */}
          <div
            style={{
              background: "rgb(22,22,22)",
              border: "1px solid rgb(38,38,38)",
              padding: "1.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid rgb(38,38,38)",
              }}
            >
              <Skeleton width="55%" height={22} />
              <Skeleton width={90} height={36} />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ padding: "0.6rem 0" }}>
                <Skeleton width="30%" height={12} />
                <Skeleton width="65%" height={17} style={{ marginTop: 6 }} />
              </div>
            ))}
          </div>

          {/* Card: Change Password */}
          <div
            style={{
              background: "rgb(22,22,22)",
              border: "1px solid rgb(38,38,38)",
              padding: "1.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                marginBottom: "1.5rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid rgb(38,38,38)",
              }}
            >
              <Skeleton width="50%" height={22} />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ padding: "0.6rem 0" }}>
                <Skeleton width="35%" height={12} />
                <Skeleton width="100%" height={42} style={{ marginTop: 6 }} />
              </div>
            ))}
            <Skeleton width="55%" height={44} style={{ marginTop: 16 }} />
          </div>

          <Skeleton width="48%" height={44} />
        </div>
      </main>
    </div>
  );
}

/*
 * Usage:
 *
 * import ProfileSkeleton from "@/components/ui/Skeleton/examples/ProfileSkeleton";
 *
 * // As a loading fallback:
 * {loading ? <ProfileSkeleton /> : <ProfilePage />}
 */
