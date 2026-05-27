import { TUser } from "@/types/auth.type";

const ACCESS_TOKEN_KEY = "smart_link_access_token";
const USER_KEY = "smart_link_user";

export const authStorage = {
  setToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  setUser: (user: TUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): TUser | null => {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem(USER_KEY);

    if (!user) return null;

    try {
      return JSON.parse(user) as TUser;
    } catch {
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
