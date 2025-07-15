import { create } from "zustand";

type CartStore = {
  cart: Cart;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalCount: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: {
    id: 0,
    userId: 0,
    products: [],
  },

  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.products.find((item) => item.id === product.id);

    const updatedProducts = existingItem
      ? cart.products.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart.products, { ...product, quantity: 1 }];

    set({ cart: { ...cart, products: updatedProducts } });
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    const updatedProducts = cart.products.filter((item) => item.id !== productId);
    set({ cart: { ...cart, products: updatedProducts } });
  },

  updateQuantity: (productId, quantity) => {
    const { cart } = get();

    if (quantity <= 0) {
      get().removeFromCart(productId);
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
    const {cart} = get()
    return cart.products.reduce((acc, item) => acc + item.quantity, 0);
  },

  getTotalPrice: () => {
    const {cart} = get()
    return cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
  },
}));
