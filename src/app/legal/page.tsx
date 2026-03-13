import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, Shield } from "lucide-react";

export const metadata: Metadata = { title: "Legal" };

const pages = [
  {
    title: "Terms of Service",
    description: "Rules and conditions for using DriveTree.",
    href: "/legal/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data.",
    href: "/legal/privacy",
    icon: Shield,
  },
];

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <main className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Legal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review our policies and terms.
          </p>
          <div className="mt-8 space-y-4">
            {pages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-border hover:shadow-sm"
              >
                <div className="rounded-lg bg-muted p-2.5">
                  <page.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{page.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
