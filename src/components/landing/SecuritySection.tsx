import { Lock, ShieldCheck, Eye, KeyRound, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const securityFeatures = [
  {
    icon: Lock,
    title: "256-Bit Encryption",
    description:
      "All data in transit is protected with TLS 1.3 / AES-256 encryption. Your connection is always secure.",
  },
  {
    icon: ShieldCheck,
    title: "OAuth 2.0 Authentication",
    description:
      "We use Google OAuth 2.0. Your Google password is never shared with or stored by DriveTree.",
  },
  {
    icon: Eye,
    title: "Zero File Storage",
    description:
      "Your files never leave Google&apos;s servers. We only read folder structure and metadata — nothing is cached.",
  },
  {
    icon: KeyRound,
    title: "Read-Only by Default",
    description:
      "DriveTree requests read-only access to your Drive. We cannot edit, delete, or share your files.",
  },
  {
    icon: RefreshCw,
    title: "Two-Step Authentication",
    description:
      "Email + password or Google OAuth, combined with Google&apos;s own 2FA for maximum protection.",
  },
  {
    icon: Trash2,
    title: "Session Cleanup",
    description:
      "When you sign out, all session data, tokens, and cached previews are completely wiped.",
  },
];

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,hsl(155_60%_40%/0.04),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            Enterprise-grade security
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your privacy is not optional
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Security is built into every layer of DriveTree — not bolted on as an afterthought.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((feat, i) => (
            <div
              key={feat.title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-7 transition-all duration-300",
                "hover:border-emerald-500/30 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-0.5"
              )}
            >
              {/* Subtle number watermark */}
              <span className="absolute -right-2 -top-4 font-display text-7xl font-extrabold text-foreground/[0.02] select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                <div className="mb-5 inline-flex rounded-xl bg-emerald-500/10 p-3">
                  <feat.icon className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
