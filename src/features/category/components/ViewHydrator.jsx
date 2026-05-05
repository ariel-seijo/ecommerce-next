"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "productView";

export default function ViewHydrator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (window.innerWidth < 700) return;

    const urlView = searchParams.get("view");
    if (urlView) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || stored === "grid") return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", stored);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
