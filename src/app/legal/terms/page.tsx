import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="py-20 sm:py-28">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 sm:px-6">
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            Last updated: March 2026. This is a template — consult a legal
            professional before launching.
          </p>

          <h1>Terms of Service</h1>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using DriveTree (&quot;the Service&quot;), you agree
            to be bound by these Terms of Service. If you do not agree, do not
            use the Service.
          </p>

          <h2>2. Service Description</h2>
          <p>
            DriveTree is a web application that connects to your Google Drive
            account via OAuth 2.0 and displays your file and folder structure as
            a navigable tree. DriveTree accesses your Drive in read-only mode.
            Your files remain hosted on Google&apos;s servers at all times — we
            do not download, copy, or store your file contents.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You must sign in with a valid Google account to use DriveTree. You
            are responsible for maintaining the security of your account. You
            must be at least 13 years old to use the Service.
          </p>

          <h2>4. Payment Terms</h2>
          <p>
            DriveTree offers a paid subscription at the price displayed at the
            time of purchase (currently $1/month for early access). Payments are
            billed monthly. You may cancel at any time; access continues through
            the end of your billing period. Refunds are not provided for partial
            billing periods.
          </p>

          <h2>5. Data Handling</h2>
          <p>
            We access your Google Drive metadata (file names, folder structure,
            MIME types, modification dates) to render the tree view. We store
            your Google OAuth tokens securely to maintain your connection. We do
            not access, read, or store the contents of your files. See our
            Privacy Policy for full details.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            DriveTree and its original content, features, and functionality are
            owned by DriveTree and protected by copyright and trademark laws.
            Your files and data remain yours.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            DriveTree is provided &quot;as is&quot; without warranty. We are not
            liable for any indirect, incidental, or consequential damages
            arising from your use of the Service. Our total liability shall not
            exceed the amount you paid in the 12 months preceding the claim.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may suspend or terminate your access at any time for violation of
            these Terms. You may delete your account at any time from the
            Settings page, which will remove all your data from our systems.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will
            be communicated via email or in-app notification. Continued use
            after changes constitutes acceptance.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about these Terms? Contact us at{" "}
            <a href="mailto:legal@drivetree.app">legal@drivetree.app</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
