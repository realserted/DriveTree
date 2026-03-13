import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="py-20 sm:py-28">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 sm:px-6">
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            Last updated: March 2026. This is a template — consult a legal
            professional before launching.
          </p>

          <h1>Privacy Policy</h1>

          <h2>1. Information We Collect</h2>
          <p>When you use DriveTree, we collect:</p>
          <ul>
            <li>
              <strong>Google profile information:</strong> your name, email
              address, and profile photo (provided via Google OAuth).
            </li>
            <li>
              <strong>Google Drive metadata:</strong> file names, folder
              structure, MIME types, file sizes, and modification dates. We do
              NOT access or store the actual contents of your files.
            </li>
            <li>
              <strong>OAuth tokens:</strong> access and refresh tokens to
              maintain your Google Drive connection. These are stored encrypted
              in our database.
            </li>
            <li>
              <strong>Usage data:</strong> basic analytics such as pages
              visited, features used, and session duration.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To display your Google Drive file tree within DriveTree.</li>
            <li>To authenticate you and maintain your session.</li>
            <li>To communicate service updates and billing information.</li>
            <li>To improve and optimize the Service.</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>DriveTree uses the following third-party services:</p>
          <ul>
            <li>
              <strong>Google:</strong> OAuth authentication and Drive API
              (read-only).
            </li>
            <li>
              <strong>Supabase:</strong> Authentication, database, and secure
              token storage.
            </li>
            <li>
              <strong>Vercel:</strong> Application hosting and deployment.
            </li>
          </ul>

          <h2>4. Data Retention & Deletion</h2>
          <p>
            We retain your data for as long as your account is active. Drive
            metadata is fetched on-demand and is not permanently cached. When
            you delete your account, all associated data (profile, connected
            drives, tokens, subscription) is permanently removed within 30 days.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> your personal data stored in our system.
            </li>
            <li>
              <strong>Delete</strong> your account and all associated data at
              any time from Settings.
            </li>
            <li>
              <strong>Revoke</strong> Google Drive access at any time via your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Account permissions
              </a>
              .
            </li>
            <li>
              <strong>Export</strong> your data upon request.
            </li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            DriveTree uses essential cookies for authentication and session
            management. We do not use advertising or tracking cookies.
          </p>

          <h2>7. Security</h2>
          <p>
            OAuth tokens are stored encrypted. All data is transmitted over
            HTTPS. We use Supabase Row Level Security to ensure users can only
            access their own data.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            DriveTree is not intended for children under 13. We do not knowingly
            collect data from children under 13.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of
            material changes via email or in-app notice.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions? Contact us at{" "}
            <a href="mailto:privacy@drivetree.app">privacy@drivetree.app</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
