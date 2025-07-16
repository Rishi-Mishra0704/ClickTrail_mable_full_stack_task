import { API_ROUTES, FAKESTORE_API_URL } from "@/lib/constants";
import ApiClient from "@/lib/services/api_client";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { groupByCategory } from "@/utils/array-utils";
import PageLayout from "@/components/layout/page-layout";
import { useCartStore } from "@/store/cart-store";
import { useAuthGuard } from "@/store/user-store";



export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export const loader: LoaderFunction = async (): Promise<Response> => {
  const { getData: getProductData } = ApiClient<Product[]>(FAKESTORE_API_URL);
  const response = await getProductData(API_ROUTES.fakeStore.products.all);
  return Response.json(response ?? []);
};

const Index = () => {
  const checked = useAuthGuard();
  const addToCart = useCartStore((store) => store.addToCart);
  const data = useLoaderData<Product[]>();
  const grouped = groupByCategory(data);

  if (!checked) return null;
  return (
    <PageLayout>
      {Object.entries(grouped).map(([category, products]) => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 capitalize border-b border-gray-300 pb-1">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="p-4 flex flex-col justify-between"
              >
                <CardContent className="flex flex-col items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-40 object-contain"
                  />
                  <h3 className="text-lg font-medium text-center">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 text-center">
                    {product.description}
                  </p>
                  <p className="text-md font-semibold">${product.price}</p>
                  <Button
                    className="w-full mt-2"
                    onClick={() => addToCart(product)}
                    data-track="add-to-cart"
                    data-item-id={product.id}
                    data-item-name={product.title}
                    data-item-price={product.price}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </PageLayout>
  );
};

export default Index;
