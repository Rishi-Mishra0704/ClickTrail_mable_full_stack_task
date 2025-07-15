import { ActionFunction } from "@remix-run/node"
import ApiClient from "../services/api_client"
import { API_ROUTES } from "@/constants"
import { Form, redirect, useActionData, useNavigation } from "@remix-run/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const action:ActionFunction = async({request}) => {
 const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    const { postData: signupRequest } = ApiClient<SignupResponse>();
    const res = await signupRequest(API_ROUTES.auth.signup, {
      name,
      email,
      password,
    });

    if (res?.success) {
      return redirect("/auth/login");
    }
    return null
  } catch (err: any) {
    console.error("Signup failed:", err);
    return Response.json({ error: "Signup failed. Try again later." }, { status: 500 });
  }
}

const Signup = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>

          </Form>
        </CardContent>
      </Card>
    </div>
  );
};


export default Signup
