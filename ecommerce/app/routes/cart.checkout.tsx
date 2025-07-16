import { useCartStore } from "@/store/cart-store";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/page-layout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUserStore } from "@/store/user-store";
import { PAGE_ROUTES } from "@/lib/constants";
import { useNavigate } from "@remix-run/react";

const CartCheckout = () => {
  const navigate = useNavigate();
  const cart = useCartStore((store) => store.cart);
  const checkout = useCartStore((store) => store.checkout);
  const totalPrice = useCartStore((store) => store.getTotalPrice());
  const removeFromCart = useCartStore((store) => store.removeFromCart);
  const [error, setError] = useState<string>("");
  const handleRemove = (productId: number) => {
    const product = cart.products.find((p) => p.id === productId);
    if (!product) return;

    if (product.quantity <= 1) {
      removeFromCart(productId);
    } else {
      useCartStore.getState().updateQuantity(productId, product.quantity - 1);
    }
  };
  const handleCheckout = async () => {
    const response = await checkout();
    if (response !== "Success") {
      setError(response);
    } else {
      navigate(PAGE_ROUTES.cart.checkoutSuccess);
    }
  };

  if (cart.products.length === 0) {
    return (
      <PageLayout>
        <div className="text-center text-gray-500 mt-10 text-lg">
          Your cart is empty.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-center">
        <Carousel className="w-[320px]">
          <CarouselContent>
            {cart.products.map((product) => (
              <CarouselItem key={product.id}>
                <Card className="p-4 shadow-lg">
                  <CardContent className="flex flex-col items-center gap-4 text-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-32 w-32 object-contain"
                    />
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold">${product.price}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {product.quantity}
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(product.id)}
                      data-track="remove-from-cart"
                      data-item-id={product.id}
                      data-item-name={product.title}
                      data-item-price={product.price}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between items-center mt-4 px-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      <div className="text-center text-xl font-bold mt-6">
        Total: ${totalPrice.toFixed(2)}
      </div>
      <div className="flex justify-center mt-4">
        <Button className="mt-10" data-track="checkout" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>

        {error && (
          <div className="text-center text-red-500 mt-4 text-sm">{error}</div>
        )}
      </div>
    </PageLayout>
  );
};

export default CartCheckout;
