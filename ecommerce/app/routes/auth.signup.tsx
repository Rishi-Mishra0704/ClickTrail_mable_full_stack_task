import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useUserStore } from "@/store/user-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@remix-run/react";
import { PAGE_ROUTES } from "@/lib/constants";

const Signup = () => {
  const signup = useUserStore((s) => s.signup);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const err = await signup(name, email, password);
    if (err) {
      setError(err);
      setIsSubmitting(false);
      return;
    }

    navigate(PAGE_ROUTES.auth.login);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg border border-gray-200 bg-white">
        <CardContent className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Create an Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Join us and start your journey
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link
              to={PAGE_ROUTES.auth.login}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign In
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

export default Signup;
