import { ActionFunction } from "@remix-run/node";
import ApiClient from "../services/api_client";
import { API_ROUTES, PAGE_ROUTES } from "@/constants";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return Response.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const { postData: signupRequest } = ApiClient<SignupResponse>();
    const res = await signupRequest(API_ROUTES.auth.signup, {
      name,
      email,
      password,
    });

    if (!res?.success) {
      return Response.json({ error: res?.message });
    }
    return redirect(PAGE_ROUTES.auth.login);
  } catch (err: unknown) {
    console.error("Signup failed:", err);
    return Response.json(
      { error: "Signup failed. Try again later." },
      { status: 500 }
    );
  }
};

const Signup = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as SignupActionData;
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

          <Form method="post" className="space-y-4">
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

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </Form>

          <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link
              to={PAGE_ROUTES.auth.login}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
          {actionData?.error && (
            <div className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md border border-red-300 my-2">
              {actionData.error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
