"use client";

import { Bell, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/stores/finance-store";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  /** Show back button instead of greeting */
  showBack?: boolean;
  showNotifications?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  showNotifications = true,
}: AppHeaderProps) {
  const router = useRouter();
  const profile = useFinanceStore((s) => s.profile);
  const unreadCount = useFinanceStore(
    (s) => s.notifications.filter((n) => !n.is_read).length
  );

  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          {!showBack && (
            <p className="text-sm text-muted-foreground">
              Привет, {profile?.full_name?.split(" ")[0] ?? "друг"} 👋
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            {title ?? "Финансы"}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {showNotifications && (
        <Link href="/notifications">
          <Button variant="glass" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>
      )}
    </header>
  );
}
