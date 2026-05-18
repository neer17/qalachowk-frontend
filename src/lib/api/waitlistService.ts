import { API_ENDPOINTS } from "@/utils/constants";

export interface WaitlistSignupRequest {
  email: string;
  website?: string; // honeypot
}

export interface WaitlistSignupResult {
  ok: boolean;
  error?: string;
}

export const WaitlistService = {
  signup: async (
    request: WaitlistSignupRequest,
  ): Promise<WaitlistSignupResult> => {
    try {
      const res = await fetch(
        `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.WAITLIST_SIGNUP.URL}`,
        {
          method: API_ENDPOINTS.WAITLIST_SIGNUP.METHOD,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        },
      );
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!res.ok) {
        return {
          ok: false,
          error: data.message || "Something went wrong. Please try again.",
        };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  },
};
