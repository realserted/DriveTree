import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Logo size="lg" />

          <h1 className="mt-8 text-center font-display text-2xl font-bold text-foreground">
            Sign in to DriveTree
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Connect your Google account to get started.
          </p>
        </div>

        {searchParams.error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            Authentication failed. Please try again.
          </div>
        )}

        <div className="mt-8">
          <GoogleSignInButton />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
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
