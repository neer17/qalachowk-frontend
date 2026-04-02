export const images = [
  "https://www.nicobar.com/cdn/shop/files/NBI036270_2_2048x.jpg?v=1730278425",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_1_2048x.jpg?v=1730278423",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_7_2048x.jpg?v=1730278434",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_3_2048x.jpg?v=1730278427",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_6_2048x.jpg?v=1730278433",
];

export const IndianStatesList = [
  "Rajasthan",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal",
  "Madhya Pradesh",
  "Bihar",
  "Andhra Pradesh",
  "Haryana",
  "Kerala",
  "Punjab",
  "Odisha",
  "Telangana",
  "Assam",
  "Jharkhand",
  "Chhattisgarh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Tripura",
  "Meghalaya",
  "Manipur",
  "Nagaland",
  "Goa",
  "Arunachal Pradesh",
  "Mizoram",
  "Sikkim",
  "Jammu and Kashmir",
  "Puducherry",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
];

export const API_ENDPOINTS = {
  ORDER_CREATE: {
    URL: "/v1/orders/create",
    METHOD: "POST",
  },
  ORDER_GET: {
    URL: "/v1/orders",
    METHOD: "GET",
  },
  ORDER_INVOICE: {
    URL: "/v1/orders",
    METHOD: "GET",
  },
  VALIDATE_DISCOUNT_CODE: {
    URL: "/v1/orders/validate-discount-code",
    METHOD: "POST",
  },
  APPLY_DISCOUNT_CODE: {
    URL: "/v1/products/discounts/apply",
    METHOD: "POST",
  },
  PRODUCTS: {
    URL: "/v1/products",
    METHOD: "GET",
  },
  PRODUCTS_BY_CATEGORY: {
    // TODO: how to include param or slug?
    URL: "/v1/products/categories",
    METHOD: "GET",
  },
  SEND_OTP: {
    URL: "/v1/auth/send-otp",
    METHOD: "POST",
  },
  REFRESH_TOKEN: {
    URL: "/v1/auth/refresh-token",
    METHOD: "POST",
  },
  VERIFY_OTP: {
    URL: "/v1/auth/verify-otp",
    METHOD: "POST",
  },
  VERIFY_OTP_AND_SIGNIN: {
    URL: "/v1/auth/verify-otp-and-signin",
    METHOD: "POST",
  },
  GOOGLE_SIGNIN: {
    URL: "/v1/auth/google",
    METHOD: "POST",
  },
  LOGOUT: {
    URL: "/v1/auth/logout",
    METHOD: "POST",
  },
  USER_CREATE: {
    URL: "/v1/users/create",
    METHOD: "POST",
  },
  USER_SIGNIN: {
    URL: "/v1/users/sign-in",
    METHOD: "POST",
  },
  WISHLIST_GET: {
    URL: "/v1/wishlist",
    METHOD: "GET",
  },
  WISHLIST_ADD: {
    URL: "/v1/wishlist",
    METHOD: "POST",
  },
  WISHLIST_REMOVE: {
    URL: "/v1/wishlist",
    METHOD: "DELETE",
  },
};

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
};

export const ACTIVE_COUNTRIES = {
  INDIA: "INDIA",
};

export const environments = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
  LOCAL: "local",
};

export const GST_RATE = 0.03; // 3% GST on all jewellery/handicrafts (CGST 1.5% + SGST 1.5%)

export const collections = {
  BLUE_POTTERY: {
    RINGS: [
      {
        id: "bpr-01",
        name: "ring-1",
        description: "blue pottery ring desc 1",
        images: [
          "https://images.cltstatic.com/media/product/350/AR00495-SS0000-bidai-ring-in-gold-plated--silver-prd-1-model.jpg",
          "https://images.cltstatic.com/media/product/350/AR00495-SS0000-bidai-ring-in-gold-plated--silver-prd-1-base.jpg",
          "https://images.cltstatic.com/media/product/350/AR00495-SS0000-bidai-ring-in-gold-plated--silver-prd-1-base.jpg",
          "https://images.cltstatic.com/media/product/350/AR00495-SS0000-bidai-ring-in-gold-plated--silver-prd-3-pd.jpg",
        ],
        video:
          "https://images.cltstatic.com/media/product/video/AR00495-SS0000-bidai-ring-in-gold-plated--silver-prd-1-video.mp4",
      },
      {
        id: "bpr-02",
        name: "ring-2",
        description: "blue pottery ring desc 2",
        images: [
          "https://images.cltstatic.com/media/product/350/AR00366-SS0000-bridechilla-ring-in-gold-plated--silver-prd-1-model.jpg",
          "https://images.cltstatic.com/media/product/350/AR00366-SS0000-bridechilla-ring-in-gold-plated--silver-prd-1-base.jpg ",
          "https://images.cltstatic.com/media/product/350/AR00366-SS0000-bridechilla-ring-in-gold-plated--silver-prd-2-base.jpg",
          "https://images.cltstatic.com/media/product/350/AR00366-SS0000-bridechilla-ring-in-gold-plated--silver-prd-3-pd.jpg",
        ],
        video:
          "https://images.cltstatic.com/media/product/video/AR00366-SS0000-bridechilla-ring-in-gold-plated--silver-prd-1-video.mp4",
      },
    ],
  },
};
