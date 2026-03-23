"use client";

import { usePathname } from "next/navigation";

const TRANSPARENT_NAVBAR_ROUTES = ["/"];

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noTopPadding = TRANSPARENT_NAVBAR_ROUTES.includes(pathname);

  return (
    <main
      style={{
        paddingTop: noTopPadding ? 0 : "var(--navbar-height, 64px)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {children}
    </main>
  );
}
