"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the first render — the inline script in layout already fires PageView on load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fbq = (window as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}
