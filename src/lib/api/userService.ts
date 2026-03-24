import { API_ENDPOINTS } from "@/utils/constants";

import type { components } from "@/types/api";
export type CreateUserRequest = components["schemas"]["CreateUserRequest"];
export type CreateUserResponse = components["schemas"]["User"];

export type UserSignInRequest = components["schemas"]["SignInRequest"];
export type UserSignInResponse = components["schemas"]["UserAuthResponse"];

export const UserService = {
  getDbUserId: async (
    provider: string | undefined,
    userId: string,
    phone?: string,
  ): Promise<string> => {
    const payload: UserSignInRequest =
      provider === "google" ? { googleAuthId: userId } : { phone: phone! };
    const response = await UserService.signIn(payload);
    return response.userId;
  },

  createUser: async (
    userData: CreateUserRequest,
  ): Promise<CreateUserResponse> => {
    const CREATE_USER_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.USER_CREATE.URL}`;
    const response = await fetch(CREATE_USER_ENDPOINT, {
      method: API_ENDPOINTS.USER_CREATE.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error creating user: ${response.statusText}`);
    }

    return response.json();
  },
  signIn: async (
    userCredentials: UserSignInRequest,
  ): Promise<UserSignInResponse> => {
    const SIGNIN_USER_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.USER_SIGNIN.URL}`;
    const response = await fetch(SIGNIN_USER_ENDPOINT, {
      method: API_ENDPOINTS.USER_SIGNIN.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userCredentials),
    });

    if (!response.ok) {
      throw new Error(`Error signing in user: ${response.statusText}`);
    }

    return response.json();
  },
};
