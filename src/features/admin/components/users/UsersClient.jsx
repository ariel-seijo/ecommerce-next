"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import UserOrderHistory from "./UserOrderHistory";

export default function UsersClient({ users, total, page, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const [drawer, setDrawer] = useState({ isOpen: false, userId: null });

  const pushParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/admin/users?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  function handleSort(field) {
    if (sort === field) {
      pushParams({ order: order === "asc" ? "desc" : "asc" });
    } else {
      pushParams({ sort: field, order: "asc" });
    }
  }

  function handlePage(newPage) {
    pushParams({ page: String(newPage) });
  }

  function handleViewOrders(user) {
    setDrawer({ isOpen: true, userId: user.id });
  }

  function handleCloseDrawer() {
    setDrawer({ isOpen: false, userId: null });
  }

  return (
    <>
      <UserFilters total={total} />

      <UserTable
        users={users}
        total={total}
        page={page}
        totalPages={totalPages}
        sort={sort}
        order={order}
        onSort={handleSort}
        onPage={handlePage}
        onViewOrders={handleViewOrders}
      />

      <UserOrderHistory
        key={drawer.userId || "closed"}
        userId={drawer.userId}
        isOpen={drawer.isOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}
