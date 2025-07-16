import { API_ROUTES, FAKESTORE_API_URL, PAGE_ROUTES } from "@/lib/constants";
import ApiClient from "@/lib/services/api_client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user-store";
import { useNavigate } from "@remix-run/react";

type CartStore = {
  cart: Cart;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalCount: () => number;
  getTotalPrice: () => number;
  checkout: () => Promise<string>;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {
        id: 0,
        userId: 0,
        products: [],
      },

      addToCart: (product) => {
        const { cart, updateQuantity } = get();
        const existingItem = cart.products.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          updateQuantity(product.id, existingItem.quantity + 1);
        } else {
          set({
            cart: {
              ...cart,
              products: [...cart.products, { ...product, quantity: 1 }],
            },
          });
        }
      },

      removeFromCart: (productId) => {
        const { cart, updateQuantity } = get();
        const existingItem = cart.products.find(
          (item) => item.id === productId
        );

        if (existingItem) {
          updateQuantity(productId, existingItem.quantity - 1);
        }
      },

      updateQuantity: (productId, quantity) => {
        const { cart } = get();

        if (quantity <= 0) {
          const updatedProducts = cart.products.filter(
            (item) => item.id !== productId
          );
          set({ cart: { ...cart, products: updatedProducts } });
          return;
        }

        const updatedProducts = cart.products.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );

        set({ cart: { ...cart, products: updatedProducts } });
      },

      clearCart: () => {
        const { cart } = get();
        set({ cart: { ...cart, products: [] } });
      },

      getTotalCount: () => {
        const { cart } = get();
        return cart.products.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { cart } = get();
        return cart.products.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
      },
      checkout: async () => {
        try {
          const user = useUserStore.getState().user;
          const { postData } = ApiClient<Cart>(FAKESTORE_API_URL);
          const req = { ...get().cart, userId: user?.id };
          const res = await postData(API_ROUTES.fakeStore.carts.add, req);

          if ((res?.products ?? []).length <= 0) {
            return "Error. Please try again.";
          }

          get().clearCart();
          return "Success"; // no error
        } catch (e) {
          return "Something went wrong. Please try again.";
        }
      },
    }),

    {
      name: "cart-store",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
