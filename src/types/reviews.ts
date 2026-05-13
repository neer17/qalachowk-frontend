export interface ReviewMedia {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
  sortOrder: number;
}

export interface PublicReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  customerName: string | null;
  customerHandle: string | null;
  isVerified: boolean;
  media: ReviewMedia[];
  product: { id: string; name: string; slug: string };
  createdAt: string;
}

export interface PublicReviewListResponse {
  data: PublicReview[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
