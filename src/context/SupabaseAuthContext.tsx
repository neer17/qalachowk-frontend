"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  loadUserState,
  saveUserState,
  clearUserState,
} from "@/utils/idb/user.idb";
import { clearCheckoutState } from "@/utils/idb/checkout.idb";
import { API_ENDPOINTS } from "@/utils/constants";

/** Unified user type — no more Supabase User dependency */
export interface AppUser {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  provider: "phone" | "google";
}

export type BackendAuthResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type AuthContextType = {
  user: AppUser | null;
  isAuthLoading: boolean;
  login: (
    backendUser: BackendAuthResponse,
    provider: "phone" | "google",
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const logout = async (): Promise<void> => {
    try {
      // Call backend logout to clear httpOnly cookies
      await fetch(
        `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.LOGOUT.URL}`,
        {
          method: API_ENDPOINTS.LOGOUT.METHOD,
          credentials: "include",
        },
      );
    } catch (error) {
      console.error("Backend logout error:", error);
    }

    await clearCheckoutState();
    await clearUserState();
    setUser(null);
  };

  const login = async (
    backendUser: BackendAuthResponse,
    provider: "phone" | "google",
  ): Promise<void> => {
    const appUser: AppUser = {
      id: backendUser.userId,
      phone: backendUser.phone,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      provider,
    };

    setUser(appUser);
    await saveUserState(appUser);
  };

  // Initialize auth from IndexedDB cache
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const cachedUser = await loadUserState();
        if (cachedUser) {
          setUser(cachedUser);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Google One Tap — disabled for now; set GOOGLE_ONE_TAP_ENABLED = true to re-enable
  const GOOGLE_ONE_TAP_ENABLED = false;
  useEffect(() => {
    if (!GOOGLE_ONE_TAP_ENABLED || isAuthLoading || user) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    if (!clientId) return;

    const GOOGLE_AUTH_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.GOOGLE_SIGNIN.URL}`;

    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: async (response: any) => {
          try {
            const res = await fetch(GOOGLE_AUTH_ENDPOINT, {
              method: API_ENDPOINTS.GOOGLE_SIGNIN.METHOD,
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ idToken: response.credential }),
            });

            if (!res.ok) {
              console.error("Google sign-in failed:", res.status);
              return;
            }

            const userData: BackendAuthResponse = await res.json();
            await login(userData, "google");
          } catch (error) {
            console.error("Google sign-in error:", error);
          }
        },
      });

      window.google.accounts.id.prompt();
    };
    document.body.appendChild(script);

    return () => {
      const gsiScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (gsiScript?.parentNode) {
        gsiScript.parentNode.removeChild(gsiScript);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user]);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
