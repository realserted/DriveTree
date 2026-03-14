import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { AuthForm } from "@/components/auth/AuthForm";
import { FolderTree, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-12 lg:flex">
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,hsl(155_60%_40%/0.15),transparent)]" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <FolderTree className="h-6 w-6 text-emerald-400" />
            <span className="font-display text-xl font-bold text-white">
              Drive<span className="text-emerald-400">Tree</span>
            </span>
          </Link>
        </div>

        <div className="relative">
          <blockquote className="max-w-md">
            <p className="text-2xl font-display font-semibold leading-snug text-white/90">
              &ldquo;Finally, a way to see my entire Google Drive without clicking through 50 folders.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-emerald-300/70">
              — What every Google Drive user thinks
            </footer>
          </blockquote>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-emerald-400/50">
          <span>Read-only access</span>
          <span>&middot;</span>
          <span>Files never leave Google</span>
          <span>&middot;</span>
          <span>Cancel anytime</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your Google Drive.
            </p>
          </div>

          <div className="mt-8">
            <AuthForm mode="login" />
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link
              href="/legal/terms"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
