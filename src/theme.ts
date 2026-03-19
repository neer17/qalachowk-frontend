import { createTheme, MantineColorsTuple, CSSProperties } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#FDF5E6", // 0 - Old Lace
  "#F5E6CC", // 1 - Champagne
  "#E8D0D0", // 2 - Bone (FIXED per brand guide)
  "#C8956C", // 3 - Warm Gold
  "#A05920", // 4 - Terracotta (FIXED per brand guide)
  "#8B4513", // 5 - Saddle Brown
  "#6A2901", // 6 - Primary Brown (brand primary)
  "#3D1800", // 7 - Deep Umber
  "#2E1503", // 8 - Dark Espresso
  "#A3A67C", // 9 - Sage (NEW accent color per brand guide)
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand,
  },
  fontFamily: "DM Sans, sans-serif",
  headings: {
    fontFamily: "Playfair Display, serif",
    sizes: {
      h1: { fontSize: "3rem" },
      h2: { fontSize: "2.25rem" },
      h3: { fontSize: "1.75rem" },
      h4: { fontSize: "1.25rem" },
    },
  },
  black: "#2E1503",
  white: "#FFFAF5",
  components: {
    Button: {
      defaultProps: {
        color: "brand.6",
      },
    },
    Title: {
      styles: {
        color: "var(--brand-primary)",
      },
    },
    Input: {
      styles: {
        // Set CSS variables on the wrapper — Mantine's own CSS reads
        // border-color from --input-bd, and on focus reassigns it to
        // --input-bd-focus. Setting them here plugs into that cascade
        // without fighting inline style specificity.
        wrapper: {
          "--input-bd": "var(--border-primary)",
          "--input-bd-focus": "var(--border-focus)",
        } as CSSProperties,
        input: {
          backgroundColor: "var(--brand-warm-white)",
        },
      },
    },
    Modal: {
      styles: {
        content: {
          backgroundColor: "var(--brand-warm-white)",
        },
      },
    },
  },
});
