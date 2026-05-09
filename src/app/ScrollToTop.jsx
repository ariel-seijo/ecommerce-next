"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    document.documentElement.scrollTop = 0;
  }, [pathname, searchParams]);

  return null;
}
