export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "";
export const FAKESTORE_API_URL = "https://fakestoreapi.com";

export const API_ROUTES = {
  auth: {
    signup: "/auth/register",
    login: "/auth/login",
  },
  fakeStore: {
    products: {
      all: "/products",
    },
  },
};

export const PAGE_ROUTES = {
  base: "/",
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
  },
  cart: {
    base: "/cart",
  },
};
