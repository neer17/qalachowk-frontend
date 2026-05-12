import { createTheme, MantineColorsTuple, CSSProperties } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#fdf0f3", // 0 - Crimson tint lightest
  "#f7d5df", // 1 - Blush
  "#eeafc0", // 2 - Rose
  "#e484a0", // 3 - Medium rose
  "#d15a7f", // 4 - Deep rose
  "#b03060", // 5 - Burgundy
  "#7d0531", // 6 - Primary crimson (button fill)
  "#620428", // 7 - Deep crimson
  "#49031e", // 8 - Very deep
  "#300114", // 9 - Darkest
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand,
  },
  fontFamily: "DM Sans, sans-serif",
  headings: {
    fontFamily: "Cormorant Garamond, serif",
    sizes: {
      h1: { fontSize: "3rem" },
      h2: { fontSize: "2.25rem" },
      h3: { fontSize: "1.75rem" },
      h4: { fontSize: "1.25rem" },
    },
  },
  black: "#1E1E1E",
  white: "#FFFCF7",
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
