import { createTheme, MantineColorsTuple, CSSProperties } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#fdeaf2", // 0 - Magenta tint lightest
  "#fad0e1", // 1 - Pale magenta
  "#f5a3c5", // 2 - Soft magenta
  "#ee76a8", // 3 - Medium magenta
  "#e6498b", // 4 - Bright magenta
  "#df3a83", // 5 - Vivid magenta
  "#d82788", // 6 - Primary magenta (CTA fill, prices, accents)
  "#b81e72", // 7 - Deep magenta
  "#931659", // 8 - Plum
  "#6d0f42", // 9 - Darkest magenta
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
  black: "#1A1A1A",
  white: "#FFFFFF",
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
