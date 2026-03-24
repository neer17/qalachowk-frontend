import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { AppUser } from "@/context/SupabaseAuthContext";

interface UserState {
  user: AppUser;
  savedAt: number;
  expiresAt: number;
}

interface UserDB extends DBSchema {
  userState: {
    key: string;
    value: UserState;
  };
}

const DB_NAME = "UserDB";
const DB_VERSION = 1;
const STORE_NAME = "userState";
const STATE_KEY = "current";
const EXPIRY_DURATION = Number(
  process.env["NEXT_PUBLIC_USER_DATA_EXPIRATION_DURATION_IN_MILLISECONDS"]!,
);

let dbInstance: IDBPDatabase<UserDB> | null = null;

async function getDB(): Promise<IDBPDatabase<UserDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<UserDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

  return dbInstance;
}

export async function saveUserState(user: AppUser): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    const state: UserState = {
      user,
      savedAt: now,
      expiresAt: now + EXPIRY_DURATION,
    };

    await db.put(STORE_NAME, state, STATE_KEY);
  } catch (error) {
    console.error("Failed to save user state:", error);
  }
}

export async function loadUserState(): Promise<AppUser | null> {
  try {
    const db = await getDB();
    const state = await db.get(STORE_NAME, STATE_KEY);

    if (!state) {
      return null;
    }

    const now = Date.now();

    // Check if state has expired
    if (now > state.expiresAt) {
      await clearUserState();
      return null;
    }

    // Validate that the cached object has the new AppUser shape.
    // Old Supabase User objects won't have these fields.
    const u = state.user;
    if (!u || !u.id || !u.provider || !("firstName" in u)) {
      await clearUserState();
      return null;
    }

    return u;
  } catch (error) {
    console.error("Failed to load user state:", error);
    return null;
  }
}

export async function clearUserState(): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, STATE_KEY);
  } catch (error) {
    console.error("Failed to clear user state:", error);
  }
}

export async function updateUserState(
  userData: Partial<AppUser>,
): Promise<void> {
  try {
    const currentState = await loadUserState();
    if (currentState) {
      const updatedUser = { ...currentState, ...userData };
      await saveUserState(updatedUser);
    }
  } catch (error) {
    console.error("Failed to update user state:", error);
  }
}

export async function isUserStateExpired(): Promise<boolean> {
  try {
    const db = await getDB();
    const state = await db.get(STORE_NAME, STATE_KEY);

    if (!state) {
      return true;
    }

    return Date.now() > state.expiresAt;
  } catch (error) {
    console.error("Failed to check user state expiry:", error);
    return true;
  }
}
