import type { PaymentInstance, AppNotification } from "@/types";

/**
 * Notification scheduling logic.
 * In production, this runs as a Supabase Edge Function + Web Push.
 */
export function generatePaymentNotifications(
  payments: PaymentInstance[],
  userId: string
): AppNotification[] {
  const now = new Date();
  const notifications: AppNotification[] = [];

  for (const payment of payments) {
    if (payment.status === "paid") continue;

    const due = new Date(payment.due_date);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (payment.status === "overdue" || diffDays < 0) {
      notifications.push({
        id: `gen-overdue-${payment.id}`,
        user_id: userId,
        type: "payment_overdue",
        title: "Просрочен платёж",
        body: `${payment.title} — ${payment.amount.toLocaleString("ru-RU")} ₽`,
        reference_id: payment.id,
        is_read: false,
        scheduled_at: null,
        sent_at: now.toISOString(),
        created_at: now.toISOString(),
      });
    } else if (diffDays === 0) {
      notifications.push({
        id: `gen-due-${payment.id}`,
        user_id: userId,
        type: "payment_due",
        title: "Платёж сегодня",
        body: `${payment.title} — ${payment.amount.toLocaleString("ru-RU")} ₽`,
        reference_id: payment.id,
        is_read: false,
        scheduled_at: null,
        sent_at: now.toISOString(),
        created_at: now.toISOString(),
      });
    } else if (diffDays <= 3) {
      notifications.push({
        id: `gen-reminder-${payment.id}`,
        user_id: userId,
        type: "payment_reminder",
        title: `Платёж через ${diffDays} дн.`,
        body: `${payment.title} — ${payment.amount.toLocaleString("ru-RU")} ₽`,
        reference_id: payment.id,
        is_read: false,
        scheduled_at: null,
        sent_at: now.toISOString(),
        created_at: now.toISOString(),
      });
    }
  }

  return notifications;
}

/** Request browser push permission (PWA) */
export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showLocalNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/icons/icon-192.png" });
}
