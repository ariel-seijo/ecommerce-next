"use client";

import dynamic from "next/dynamic";

const ReceiptDownload = dynamic(
  () => import("@/features/orders/components/ReceiptDownload"),
  { ssr: false }
);

export default function ReceiptDownloadWrapper({ order }) {
  return <ReceiptDownload order={order} />;
}
