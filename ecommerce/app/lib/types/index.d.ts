type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
}

type GeneralResponse<T> = {
    data: T;
    message: string;
    success: boolean;
    error:unknown;

}

type SignupResponse = GeneralResponse<User>;

type SignupActionData = {
  error?: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

type CartItem = Product & {
  quantity: number;
};

type Cart = {
  id: number;     
  userId: number;
  products: CartItem[];
};

type AuthUser = {
  id: number;
  name: string;
  email: string;
  token: string;
  expires_at: string;
};

type LoginResponse = GeneralResponse<AuthUser>