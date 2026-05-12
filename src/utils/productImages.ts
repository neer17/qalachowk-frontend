export type ProductImageSize = "thumbnail" | "medium" | "large" | "original";

export interface ProductImageRenditions {
  url: string;
  thumbnailUrl?: string | null;
  mediumUrl?: string | null;
  largeUrl?: string | null;
  mimeType?: string | null;
}

export function getProductImageUrl(
  image: ProductImageRenditions,
  size: ProductImageSize,
): string {
  if (size === "thumbnail") {
    return image.thumbnailUrl ?? image.mediumUrl ?? image.largeUrl ?? image.url;
  }

  if (size === "medium") {
    return image.mediumUrl ?? image.largeUrl ?? image.url;
  }

  if (size === "large") {
    return image.largeUrl ?? image.url;
  }

  return image.url;
}

export function isVideoImage(image: ProductImageRenditions): boolean {
  const mimeType = image.mimeType?.toLowerCase();
  if (mimeType?.startsWith("video/")) {
    return true;
  }

  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(image.url);
}
