"use client";

import { Bell, AlertTriangle, Clock, Target, Check } from "lucide-react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useFinanceStore } from "@/stores/finance-store";
import { cn, formatDate } from "@/lib/utils";
import type { NotificationType } from "@/types";

const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  payment_reminder: { icon: Clock, color: "#FFD43B" },
  payment_due: { icon: Bell, color: "#4C6EF5" },
  payment_overdue: { icon: AlertTriangle, color: "#FF6B6B" },
  savings_reminder: { icon: Target, color: "#00D68F" },
  goal_deadline: { icon: Target, color: "#845EF7" },
};

export default function NotificationsPage() {
  const notifications = useFinanceStore((s) => s.notifications);
  const markRead = useFinanceStore((s) => s.markNotificationRead);
  const markAllRead = useFinanceStore((s) => s.markAllNotificationsRead);

  const unread = notifications.filter((n) => !n.is_read);

  return (
    <div>
      <AppHeader
        title="Уведомления"
        subtitle={unread.length > 0 ? `${unread.length} непрочитанных` : "Всё прочитано"}
        showBack
        showNotifications={false}
      />

      {unread.length > 0 && (
        <div className="px-5 pb-4">
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <Check className="h-4 w-4" /> Прочитать все
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Нет уведомлений"
          description="Здесь будут напоминания о платежах и накоплениях"
        />
      ) : (
        <div className="space-y-2 px-5">
          {notifications.map((n, i) => {
            const config = TYPE_CONFIG[n.type];
            const Icon = config.icon;
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                  n.is_read
                    ? "border-border/30 bg-card/50 opacity-60"
                    : "border-border/50 bg-card"
                )}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{n.title}</p>
                    {!n.is_read && <Badge variant="default">Новое</Badge>}
                  </div>
                  {n.body && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(n.created_at)}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
