"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet, Plane, BarChart3, Bell, Settings,
  ChevronRight, Moon, Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { AppHeader } from "@/components/layout/app-header";
import { MORE_MENU_ITEMS } from "@/lib/constants";
import { useFinanceStore } from "@/stores/finance-store";
import { formatMoney } from "@/lib/utils";

const ICONS = {
  Wallet, Plane, BarChart3, Bell, Settings,
};

export default function MorePage() {
  const { theme, setTheme } = useTheme();
  const profile = useFinanceStore((s) => s.profile);
  const income = useFinanceStore((s) => s.income);

  return (
    <div>
      <AppHeader title="Ещё" showNotifications={false} />

      <div className="mx-5 mb-6 rounded-3xl bg-gradient-to-br from-premium/20 to-accent/10 p-5">
        <p className="text-sm text-muted-foreground">{profile?.email}</p>
        <p className="text-xl font-bold">{profile?.full_name}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Зарплата: {formatMoney(income?.salary ?? 0)}
        </p>
      </div>

      <div className="space-y-2 px-5">
        {MORE_MENU_ITEMS.map((item, i) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 transition-colors active:bg-muted"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </motion.div>
          );
        })}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-card p-4"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold">Тема</p>
            <p className="text-xs text-muted-foreground">
              {theme === "dark" ? "Тёмная" : theme === "light" ? "Светлая" : "Системная"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
