"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import {
  loadUserState,
  saveUserState,
  clearUserState,
} from "@/utils/idb/user.idb";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
  user: User | null;
  supabase: SupabaseClient;
  login: (backendUser: BackendAuthResponse) => Promise<void>;
  logout: () => Promise<void>;
};

export type BackendAuthResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accessToken: string;
  refreshToken: string;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase logout error:", error);
        throw error;
      }

      // Clear user from IDB
      await clearUserState();

      // Clear local state
      setUser(null);

      console.log("✅ User logged out successfully");
    } catch (error) {
      console.error("❌ Failed to logout user:", error);
      throw error;
    }
  };

  // Login function for backend phone OTP sign-in
  const login = async (backendUser: BackendAuthResponse): Promise<void> => {
    const syntheticUser: User = {
      id: backendUser.userId,
      email: backendUser.email,
      phone: backendUser.phone,
      app_metadata: { provider: "phone" },
      user_metadata: {
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
      },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    setUser(syntheticUser);
    await saveUserState(syntheticUser);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, try to load user from IDB
        const cachedUser = await loadUserState();
        if (cachedUser) {
          console.log("✅ Loaded user from IDB:", cachedUser.email);
          setUser(cachedUser);
          setIsUserLoaded(true);
          return;
        }

        // If no cached user, get current session from Supabase
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          // Save to IDB for future use
          await saveUserState(data.user);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsUserLoaded(true);
      }
    };

    initializeAuth();

    // Listen for auth state changes (only for Supabase-managed sessions like Google sign-in)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;

        console.info("onAuthStateChanged", { event, user: newUser });

        if (newUser) {
          // Supabase session exists — update state and persist
          setUser(newUser);
          await saveUserState(newUser);
        } else if (event === "SIGNED_OUT") {
          // Only clear on explicit sign-out, not on missing session
          // (phone OTP users have no Supabase session, so session is always null for them)
          setUser(null);
          await clearUserState();
        }
        // For other events with null session (INITIAL_SESSION, TOKEN_REFRESHED, etc.),
        // do nothing — preserve any phone-authenticated user already in state/IDB.
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 👇 Google One Tap integration - only show if no user in IDB
  useEffect(() => {
    // Don't show Google One Tap if:
    // 1. User data is still loading
    // 2. User is already authenticated (from IDB or Supabase)
    if (!isUserLoaded || user) {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    if (!clientId) return;

    // Gracefully disable Google One Tap natively if the local dev server is running
    // over a non-secure HTTP context where the Web Crypto API is forcefully undefined.
    if (typeof window !== "undefined" && !window.crypto?.subtle) {
      console.warn(
        "Web Crypto API (crypto.subtle) is unavailable. Disabling Google One Tap. (Are you running on HTTP?)",
      );
      return;
    }

    // Generate a nonce for Google One Tap + Supabase
    const rawNonce = uuidv4();
    const encodedNonce = new TextEncoder().encode(rawNonce);
    crypto.subtle.digest("SHA-256", encodedNonce).then((hashBuffer) => {
      const hashedNonce = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Load Google One Tap
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // @ts-expect-error Property 'google' does not exist on type 'Window & typeof globalThis'.
        window.google.accounts.id.initialize({
          client_id: clientId,
          nonce: hashedNonce,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: async (response: any) => {
            const { credential } = response;
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: credential,
              nonce: rawNonce,
            });

            if (error) {
              console.error("Google sign-in error:", error);
            } else if (data.user) {
              setUser(data.user);
              // Save to IDB after successful Google sign-in
              await saveUserState(data.user);
            }
          },
        });
        // Show the prompt
        // @ts-expect-error Property 'google' does not exist on type 'Window & typeof globalThis'.
        window.google.accounts.id.prompt();
      };
      document.body.appendChild(script);
    });

    // Cleanup script on unmount
    return () => {
      const gsiScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (gsiScript?.parentNode) {
        gsiScript.parentNode.removeChild(gsiScript);
      }
    };
  }, [isUserLoaded, user]);

  return (
    <AuthContext.Provider value={{ user, supabase, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
