import { API_ENDPOINTS } from "@/utils/constants";

export async function refreshSession(): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.REFRESH_TOKEN.URL}`,
      {
        method: API_ENDPOINTS.REFRESH_TOKEN.METHOD,
        credentials: "include",
      },
    );

    return res.ok;
  } catch {
    return false;
  }
}
