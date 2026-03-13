import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAccessToken(userId: string): Promise<string | null> {
  const supabase = createServerSupabaseClient();

  const { data: drive } = await supabase
    .from("connected_drives")
    .select("access_token, refresh_token, token_expires_at")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (!drive) return null;

  const expiresAt = new Date(drive.token_expires_at);
  const now = new Date();

  // If token is still valid (with 5 min buffer), return it
  if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
    return drive.access_token;
  }

  // Token expired — refresh it
  if (!drive.refresh_token) return null;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: drive.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) return null;

    const tokens = await res.json();
    const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await supabase
      .from("connected_drives")
      .update({
        access_token: tokens.access_token,
        token_expires_at: newExpiresAt.toISOString(),
      })
      .eq("user_id", userId)
      .eq("is_active", true);

    return tokens.access_token;
  } catch {
    return null;
  }
}
