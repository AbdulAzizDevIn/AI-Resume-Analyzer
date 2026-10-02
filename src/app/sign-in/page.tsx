"use client";

import { ArrowRight, FileText, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Failed to signin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <FileText className="h-5 w-5 text-indigo-600" strokeWidth={1.7} />

            <span className="absolute -bottom-1 -right-1 rounded-[4px] bg-black px-1 py-0.5 text-[7px] font-bold leading-none text-white">
              AI
            </span>
          </div>

          <span className="text-lg font-semibold tracking-[-0.03em] text-gray-900">
            AI Resume Analyzer
          </span>
        </Link>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="space-y-2 px-6 pt-7 text-center sm:px-8">
            <CardTitle className="text-2xl font-bold tracking-[-0.03em] text-gray-900">
              Welcome back
            </CardTitle>

            <p className="text-sm leading-6 text-gray-600">
              Sign in to continue analyzing your resume.
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-7 sm:px-8">
            <Button
              type="button"
              variant="outline"
              className="mt-6 h-11 w-full border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs text-gray-500">
                OR CONTINUE WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            {error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          Secure authentication powered by Better Auth.
        </p>
      </div>
    </main>
  );
}
