import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";
import ApiClient from "@/lib/services/api_client";
import { useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";

type UserStore = {
  user: AuthUser | null;

  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      isAuthenticated: () => !!get().user?.token,

      login: async (email, password) => {
        try {
          const { postData } = ApiClient<any>();
          const res = await postData(API_ROUTES.auth.login, {
            email,
            password,
          });

          if (res?.success) {
            set({ user: res.data });
            return null;
          }

          return res?.message || "Login failed";
        } catch (e) {
          return "Something went wrong. Please try again.";
        }
      },

      signup: async (name, email, password) => {
        try {
          const { postData } = ApiClient<any>();
          const res = await postData(API_ROUTES.auth.signup, {
            name,
            email,
            password,
          });

          return res?.success ? null : res?.message || "Signup failed";
        } catch {
          return "Something went wrong. Please try again.";
        }
      },

      logout: () => {
        set({ user: null, });
        
        localStorage.removeItem("user-store");
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);


export const useAuthGuard = () => {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(PAGE_ROUTES.auth.login);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, navigate]);

  return checked;
};
