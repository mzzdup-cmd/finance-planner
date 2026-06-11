import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format amount in RUB with thin-space thousands separator */
export function formatMoney(amount: number, currency = "RUB"): string {
  const formatted = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  if (currency === "RUB") return `${formatted} ₽`;
  return `${formatted} ${currency}`;
}

export function formatCompactMoney(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ₽`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ₽`;
  return formatMoney(amount);
}

export function formatDate(date: string | Date, style: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: style === "long" ? "numeric" : undefined,
  }).format(d);
}

export function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseMonthKey(key: string): { year: number; month: number } {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m };
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return getMonthKey(now.getFullYear(), now.getMonth() + 1);
}

export function hapticTap(): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export function percentOf(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}
