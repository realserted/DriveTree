import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Logo size="lg" />

          <h1 className="mt-8 text-center font-display text-2xl font-bold text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Start organizing your Google Drive today.
          </p>
        </div>

        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link
            href="/legal/terms"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
