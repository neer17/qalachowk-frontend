"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase,
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

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;

        console.info("onAuthStateChanged", { user: newUser });
        setUser(newUser);

        if (newUser) {
          // Save user to IDB when authenticated
          await saveUserState(newUser);
        } else {
          // Clear IDB when user logs out
          await clearUserState();
        }
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

    // Generate a nonce for Google One Tap + Supabase
    const rawNonce = crypto.randomUUID();
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
    <AuthContext.Provider value={{ user, supabase, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
