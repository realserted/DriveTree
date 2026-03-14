import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Store the Google provider tokens for Drive API access
      const providerToken = data.session.provider_token;
      const providerRefreshToken = data.session.provider_refresh_token;
      const user = data.session.user;

      if (providerToken) {
        // Upsert the connected drive record
        await supabase.from("drivetree_connected_drives").upsert(
          {
            user_id: user.id,
            google_email: user.email!,
            access_token: providerToken,
            refresh_token: providerRefreshToken || null,
            token_expires_at: new Date(
              Date.now() + 3600 * 1000
            ).toISOString(),
            is_active: true,
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: "user_id,google_email" }
        );
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
