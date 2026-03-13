export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectedDrive {
  id: string;
  user_id: string;
  google_email: string;
  is_active: boolean;
  connected_at: string;
  last_synced_at: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "early_access" | "free" | "pro" | "team";
  status: "active" | "cancelled" | "past_due" | "trialing";
  price_cents: number;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}
