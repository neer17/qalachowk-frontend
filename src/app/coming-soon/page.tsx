import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon/ComingSoon";

export const metadata: Metadata = {
  title: "Coming Soon — Gulchharre",
  description:
    "Gulchharre is launching soon. Sign up to be the first to know when we go live.",
  openGraph: {
    title: "Coming Soon — Gulchharre",
    description:
      "Gulchharre is launching soon. Sign up to be the first to know.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coming Soon — Gulchharre",
    description:
      "Gulchharre is launching soon. Sign up to be the first to know.",
  },
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
