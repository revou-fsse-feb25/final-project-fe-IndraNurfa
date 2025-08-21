"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  type LoginFormValues = z.infer<typeof loginFormSchema>;

  const [loginError, setLoginError] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const searchParams = useSearchParams();

  // Check if user was redirected from signup and set initial state
  const [showSignupSuccess, setShowSignupSuccess] = useState<boolean>(
    searchParams.get("from") === "signup",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(""); // Clear previous errors
    setLoginSuccess(false); // Clear previous success state
    setShowSignupSuccess(false); // Hide signup success message when submitting

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result) {
        setLoginError("Authentication failed. Please try again.");
        return;
      }

      if (result.error) {
        console.error("Login error:", result.error);
        // Map specific error messages
        switch (result.error) {
          case "CredentialsSignin":
            setLoginError(
              "Invalid email or password. Please check your credentials.",
            );
            break;
          case "CallbackRouteError":
            setLoginError(
              "Server error during authentication. Please try again.",
            );
            break;
          default:
            setLoginError("Login failed. Please try again.");
        }
        return;
      }

      if (result.ok) {
        // Show success message
        setLoginSuccess(true);

        // Redirect after a brief delay to show success message
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Success message from signup */}
              {showSignupSuccess && (
                <div className="bg-primary/10 text-primary border-muted-foreground rounded-md border p-3 text-sm">
                  ✅ Account created successfully! Please login with your
                  credentials.
                </div>
              )}

              {/* Login success message */}
              {loginSuccess && (
                <div className="text-primary bg-primary/10 border-muted-foreground rounded-md border p-3 text-sm">
                  ✅ Login successful! Redirecting...
                </div>
              )}

              {/* Error message */}
              {loginError && (
                <div className="bg-foreground rounded-md border border-red-200 p-3 text-sm text-red-600">
                  ❌ {loginError}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jhon-doe@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  disabled={loginSuccess}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  disabled={loginSuccess}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || loginSuccess}
                >
                  {loginSuccess
                    ? "Redirecting..."
                    : isSubmitting
                      ? "Logging in..."
                      : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
