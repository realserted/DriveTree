import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { AuthForm } from "@/components/auth/AuthForm";
import { FolderTree } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,hsl(155_60%_40%/0.15),transparent)]" />

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
              See every file, every folder — organized in one beautiful tree view.
            </p>
            <footer className="mt-4 text-sm text-emerald-300/70">
              Join thousands of users who switched to DriveTree.
            </footer>
          </blockquote>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-emerald-400/50">
          <span>Free to start</span>
          <span>&middot;</span>
          <span>No credit card required</span>
          <span>&middot;</span>
          <span>Set up in seconds</span>
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start organizing your Google Drive today.
            </p>
          </div>

          <div className="mt-8">
            <AuthForm mode="signup" />
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
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
