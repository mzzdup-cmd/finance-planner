"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { useFinanceStore } from "@/stores/finance-store";
import { formatMoney, cn } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/constants";

export default function CalendarPage() {
  const payments = useFinanceStore((s) => s.payments);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const monthPayments = useMemo(
    () => payments.filter((p) => p.year === viewYear && p.month === viewMonth),
    [payments, viewYear, viewMonth]
  );

  const paymentsByDay = useMemo(() => {
    const map = new Map<number, typeof monthPayments>();
    for (const p of monthPayments) {
      const day = new Date(p.due_date).getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(p);
    }
    return map;
  }, [monthPayments]);

  const selectedPayments = selectedDay ? paymentsByDay.get(selectedDay) ?? [] : [];

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
  };

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div>
      <AppHeader title="Календарь" subtitle="Платежи по датам" showNotifications={false} />

      <div className="mx-5 rounded-3xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold">
            {MONTH_NAMES[viewMonth - 1]} {viewYear}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d) => (
            <div key={d} className="py-1 text-xs font-medium text-muted-foreground">{d}</div>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayPayments = paymentsByDay.get(day) ?? [];
            const hasOverdue = dayPayments.some((p) => p.status === "overdue");
            const hasPending = dayPayments.some((p) => p.status === "pending");
            const isToday =
              day === now.getDate() &&
              viewMonth === now.getMonth() + 1 &&
              viewYear === now.getFullYear();
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-all",
                  isSelected && "bg-accent text-accent-foreground font-bold",
                  !isSelected && isToday && "ring-2 ring-accent/50",
                  !isSelected && "hover:bg-muted"
                )}
              >
                {day}
                {dayPayments.length > 0 && !isSelected && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {hasOverdue && <div className="h-1 w-1 rounded-full bg-destructive" />}
                    {hasPending && <div className="h-1 w-1 rounded-full bg-warning" />}
                    {dayPayments.some((p) => p.status === "paid") && (
                      <div className="h-1 w-1 rounded-full bg-success" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 px-5">
        <h3 className="mb-3 font-semibold">
          {selectedDay
            ? `${selectedDay} ${MONTH_NAMES[viewMonth - 1].toLowerCase()}`
            : "Выберите день"}
        </h3>
        {selectedPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет платежей на эту дату</p>
        ) : (
          <div className="space-y-2">
            {selectedPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-1 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{p.status}</p>
                  </div>
                </div>
                <span className="font-bold tabular-nums">{formatMoney(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
