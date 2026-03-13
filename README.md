# 🌳 DriveTree

**Google Drive NEEDS a File Tree.** Stop digging through folders. See your Drive as a clean tree.

DriveTree is a SaaS web application that connects to your Google Drive and displays your entire file/folder structure as a navigable, collapsible file tree. Your files stay on Google — we only read the structure.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth & Database:** Supabase (Google OAuth + PostgreSQL)
- **API:** Google Drive API v3 (read-only)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project with Drive API enabled

### 1. Clone & Install

```bash
git clone https://github.com/your-username/drivetree.git
cd drivetree
pnpm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Fill in your Supabase and Google OAuth credentials in `.env.local`.

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to **Authentication > Providers > Google** and enable it with your Google Client ID & Secret
3. Run the migration in **SQL Editor**:
   - Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it

### 4. Google Cloud Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable the **Google Drive API**
3. Create **OAuth 2.0 credentials** (Web application)
4. Add authorized redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to both `.env.local` and Supabase dashboard

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/drive/          # Google Drive API proxy routes
│   ├── auth/callback/      # OAuth callback handler
│   ├── dashboard/          # Authenticated app (drives, profile, settings)
│   ├── legal/              # TOS + Privacy Policy
│   ├── login/              # Google sign-in page
│   └── pricing/            # Pricing page
├── components/
│   ├── auth/               # Google sign-in button
│   ├── drives/             # File tree, viewer, explorer layout
│   ├── landing/            # Hero, features, demo, CTA
│   ├── layout/             # Navbar, sidebar, topbar, footer
│   ├── pricing/            # Pricing card
│   ├── shared/             # Logo, loading spinner
│   └── ui/                 # shadcn/ui primitives
├── config/                 # Site + nav configuration
├── hooks/                  # useUser, useDriveFiles, useFilePreview
├── lib/
│   ├── google/             # Drive API helpers + OAuth token management
│   └── supabase/           # Client, server, middleware helpers
└── types/                  # TypeScript types
```

## Key Design Decisions

- **Read-only access only.** We request `drive.readonly` scope — no write/delete permissions.
- **Files never leave Google.** We render previews via Google's embed URLs and proxy text content through our API routes.
- **Lazy-load tree.** Only root-level items load initially; folder children are fetched on expand.
- **Token proxy.** All Drive API calls go through Next.js API routes — OAuth tokens never reach the browser.

## License

MIT
