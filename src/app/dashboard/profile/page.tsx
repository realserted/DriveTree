"use client";

import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarImage, AvatarFallback, Badge } from "@/components/ui/primitives";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { Mail, Calendar, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) return <LoadingSpinner className="py-24" />;
  if (!user) return null;

  const meta = user.user_metadata;
  const avatarUrl = meta?.avatar_url;
  const name = meta?.full_name || user.email || "";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Profile
      </h1>

      <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-5">
          <Avatar className="h-16 w-16">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <Badge variant="success" className="mt-1">
              Early Access
            </Badge>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              Joined {formatDate(user.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              Plan: Early Access ($1/month)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
