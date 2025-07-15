import { PAGE_ROUTES } from "@/lib/constants";
import {
  Link,
  useNavigate,
} from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";

const Login = () => {
  const login = useUserStore((s) => s.login);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const err = await login(email, password);

    if (err) {
      setError(err);
      setIsSubmitting(false);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login"}
            </Button>
          </form>
          <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
            <span>Don't have an account? </span>
            <Link
              to={PAGE_ROUTES.auth.signup}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
          {error && (
            <div className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md border border-red-300 my-2">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
