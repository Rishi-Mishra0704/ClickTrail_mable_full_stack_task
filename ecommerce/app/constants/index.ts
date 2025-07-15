export const API_BASE_URL = import.meta.env.VITE_REMIX_BACKEND_URL ?? "";


export const API_ROUTES = {
  auth: {
    signup: "/auth/register",
    login: "/auth/login",
  },
};

export const PAGE_ROUTES = {
base: "/",
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
  },
};
