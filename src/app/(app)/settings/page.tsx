"use client";

import { Moon, Sun, Monitor, Bell, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { useFinanceStore } from "@/stores/finance-store";
import { cn } from "@/lib/utils";

const THEMES = [
  { key: "light", label: "Светлая", icon: Sun },
  { key: "dark", label: "Тёмная", icon: Moon },
  { key: "system", label: "Системная", icon: Monitor },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const profile = useFinanceStore((s) => s.profile);

  return (
    <div>
      <AppHeader title="Настройки" showBack showNotifications={false} />

      <div className="mx-5 mb-6 flex items-center gap-4 rounded-3xl border border-border/50 bg-card p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
          <User className="h-7 w-7 text-accent" />
        </div>
        <div>
          <p className="font-semibold">{profile?.full_name}</p>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      <div className="px-5">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Тема оформления</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const active = theme === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border/50 bg-card"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 px-5">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Уведомления</h3>
        <div className="rounded-2xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-xs text-muted-foreground">
                  За 3 дня, в день платежа, просрочки
                </p>
              </div>
            </div>
            <div className="h-6 w-11 rounded-full bg-accent p-0.5">
              <div className="h-5 w-5 translate-x-5 rounded-full bg-white shadow transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 px-5">
        <Button variant="outline" className="w-full gap-2 text-destructive">
          <LogOut className="h-4 w-4" /> Выйти
        </Button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Finance Planner v0.1.0 · PWA
      </p>
    </div>
  );
}
