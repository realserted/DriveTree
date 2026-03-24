import { cn } from "@/lib/utils";

const providers = [
  {
    name: "Google Drive",
    status: "live" as const,
    logo: (
      <svg viewBox="0 0 87.3 78" className="h-8 w-8">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47" />
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 9.85z" fill="#ea4335" />
        <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
        <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h22.55c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
        <path d="M73.4 26.5 60.65 3.3c-.8-1.4-1.95-2.5-3.3-3.3L43.6 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
      </svg>
    ),
  },
  {
    name: "OneDrive",
    status: "coming" as const,
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
        <path d="M10.5 18.5h8.25a3.75 3.75 0 0 0 .75-7.43 4.5 4.5 0 0 0-7.97-2.07A3.75 3.75 0 0 0 6 12.75c0 .26.03.51.08.75A3 3 0 0 0 9 18.5h1.5z" fill="#0078d4" />
        <path d="M9 18.5a3 3 0 0 1-2.92-5c.05-.24.08-.49.08-.75a3.75 3.75 0 0 1 5.53-3.75 4.47 4.47 0 0 1 2.31-.93A5.25 5.25 0 0 0 4.5 12a5.25 5.25 0 0 0-1.13 10.38A3.35 3.35 0 0 1 3 21a3 3 0 0 0 3 3h7.5a2.25 2.25 0 0 0 0-4.5H9z" fill="#0364b8" />
      </svg>
    ),
  },
  {
    name: "Dropbox",
    status: "coming" as const,
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <path d="m7.1 2 4.9 3.1L7.1 8.2 2.2 5.1zm9.8 0L12 5.1l4.9 3.1 4.9-3.1zM2.2 11.3 7.1 8.2 12 11.3l-4.9 3.1zm14.7-3.1 4.9 3.1-4.9 3.1L12 11.3zM7.1 15.5 12 12.4l4.9 3.1L12 18.6z" fill="#0061ff" />
      </svg>
    ),
  },
  {
    name: "iCloud",
    status: "coming" as const,
    logo: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#3693f5" />
      </svg>
    ),
  },
  {
    name: "Amazon Drive",
    status: "coming" as const,
    logo: (
      <svg viewBox="0 0 24 24" className="h-7 w-7">
        <path d="M.045 18.02c.07-.116.196-.2.338-.2a.474.474 0 0 1 .243.07C2.12 19.23 5.558 20.4 9.685 20.4c2.93 0 6.162-.876 8.843-2.4.394-.22.7-.396.955-.526a.474.474 0 0 1 .22-.06c.26 0 .396.2.396.44a.61.61 0 0 1-.2.44c-.8.78-3.49 2.64-8.61 2.64-4.79 0-8.925-1.68-11.244-2.874zm-.045-.02z" fill="#f90" />
        <path d="M21.397 16.58c-.27-.35-.66-.52-1.29-.52-.63 0-1.29.08-1.89.24-.27.07-.45.15-.5.33-.05.13-.02.3.13.3.1 0 .25-.04.47-.1.65-.14 1.24-.2 1.72-.2.58 0 .76.15.76.47 0 .3-.08.65-.15.97-.4 1.67-1.74 5.04-2.26 6.26-.08.2-.02.33.15.33.12 0 .3-.07.42-.22.13-.17 1.65-2.2 2.25-3.5.34-.75.62-1.67.62-2.48 0-.43-.08-.77-.42-1.28z" fill="#f90" />
        <path d="M12 3.6c-3.76 0-6.8 2.38-6.8 5.94 0 3.1 2.15 5.26 5.5 5.26 1.1 0 2.05-.18 2.85-.52.3-.13.56-.3.56-.56 0-.23-.2-.38-.46-.38a1.1 1.1 0 0 0-.38.08 6.13 6.13 0 0 1-2.43.5c-2.57 0-4.04-1.74-4.04-4.24 0-2.88 1.97-4.94 4.96-4.94 2.5 0 4.03 1.46 4.03 3.6 0 1.5-.48 3.06-1.52 3.06-.53 0-.87-.38-.77-.98l.65-3.32c.08-.38-.15-.67-.56-.67-.53 0-1.13.58-1.34 1.23h-.03c-.38-.78-1.12-1.23-1.96-1.23-1.8 0-3.22 1.84-3.22 4.04 0 1.46.7 2.4 1.84 2.4.88 0 1.56-.55 2.02-1.2h.03l-.13.66c-.07.4.15.65.55.65.97 0 1.84-.5 2.52-1.38.77-1 1.3-2.58 1.3-4.06 0-2.87-1.96-4.73-5.17-4.73z" fill="#333" />
      </svg>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section className="relative border-t border-border/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Integrations
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All your cloud storage, one tree
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Connect Google Drive today. OneDrive, Dropbox, iCloud, and Amazon
            Drive are coming soon.
          </p>
        </div>

        {/* Hub layout */}
        <div className="relative mx-auto max-w-3xl">
          {/* Connection lines (visible on lg) */}
          <div className="absolute inset-0 hidden lg:block">
            <svg
              className="h-full w-full text-border"
              viewBox="0 0 600 320"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Lines from center to each provider */}
              <line x1="300" y1="160" x2="80" y2="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
              <line x1="300" y1="160" x2="520" y2="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
              <line x1="300" y1="160" x2="80" y2="260" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
              <line x1="300" y1="160" x2="520" y2="260" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
              <line x1="300" y1="160" x2="300" y2="300" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
            </svg>
          </div>

          {/* Center: DriveTree logo */}
          <div className="relative z-10 mx-auto mb-12 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary/30 bg-primary/10 shadow-lg shadow-primary/10 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:mb-0">
            <svg viewBox="0 0 40 40" className="h-10 w-10 text-primary" fill="currentColor">
              <path d="M20 4 L8 12 L8 28 L20 36 L32 28 L32 12 Z M20 8 L28 13 L28 17 L20 22 L12 17 L12 13 Z" />
            </svg>
          </div>

          {/* Provider grid */}
          <div className="relative z-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:pt-0">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className={cn(
                  "group relative flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all duration-300",
                  provider.status === "live"
                    ? "border-primary/30 shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10"
                    : "border-border/40 opacity-75 hover:opacity-100 hover:shadow-md"
                )}
              >
                {provider.status === "live" && (
                  <span className="absolute -top-2.5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    LIVE
                  </span>
                )}
                {provider.status === "coming" && (
                  <span className="absolute -top-2.5 rounded-full bg-muted border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    SOON
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center">
                  {provider.logo}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {provider.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
