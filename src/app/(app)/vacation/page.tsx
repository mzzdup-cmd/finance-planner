"use client";

import { Plane, MapPin, Calendar, Wallet } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFinanceStore } from "@/stores/finance-store";
import { tripSavingsPlan } from "@/lib/calculations";
import { formatMoney, formatDate } from "@/lib/utils";
import { VACATION_EXPENSE_TYPES } from "@/lib/constants";

export default function VacationPage() {
  const trips = useFinanceStore((s) => s.trips);
  const expenses = useFinanceStore((s) => s.expenses);
  const trip = trips[0];

  if (!trip) {
    return (
      <div>
        <AppHeader title="Отпуск" showBack showNotifications={false} />
        <div className="px-5 py-16 text-center text-muted-foreground">
          Создайте поездку в настройках
        </div>
      </div>
    );
  }

  const tripExpenses = expenses.filter((e) => e.trip_id === trip.id);
  const plannedTotal = tripExpenses.reduce((s, e) => s + e.amount, 0);
  const plan = tripSavingsPlan(trip);

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <AppHeader title="Отпуск" subtitle={trip.title} showBack showNotifications={false} />

      <div className="mx-5 mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-premium to-accent p-6 text-white">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{trip.destination}</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold">{trip.title}</h2>
        <div className="mt-3 flex items-center gap-4 text-sm text-white/80">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
          </span>
          <span>{days} дней</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Бюджет</p>
          <p className="text-xl font-bold tabular-nums">{formatMoney(trip.budget)}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Накоплено</p>
          <p className="text-xl font-bold tabular-nums text-success">{formatMoney(trip.saved_amount)}</p>
        </GlassCard>
      </div>

      <div className="mx-5 mt-5 rounded-3xl border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Прогресс накоплений</span>
          <Badge variant="default">{plan.percent}%</Badge>
        </div>
        <Progress value={plan.percent} className="mt-3 h-3" />
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Осталось</p>
            <p className="font-bold tabular-nums">{formatMoney(plan.remaining)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">В месяц</p>
            <p className="font-bold tabular-nums">{formatMoney(plan.monthlyNeeded)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-5">
        <h3 className="mb-3 font-semibold">План расходов</h3>
        <div className="space-y-2">
          {tripExpenses.map((exp) => {
            const type = VACATION_EXPENSE_TYPES[exp.expense_type];
            return (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold"
                    style={{ backgroundColor: `${type.color}20`, color: type.color }}
                  >
                    <Plane className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">{type.label}</p>
                  </div>
                </div>
                <span className="font-bold tabular-nums">{formatMoney(exp.amount)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted p-4">
          <span className="flex items-center gap-2 font-medium">
            <Wallet className="h-4 w-4" /> Итого
          </span>
          <span className="text-lg font-bold tabular-nums">{formatMoney(plannedTotal)}</span>
        </div>
      </div>

      <div className="mx-5 mt-6 mb-4">
        <h3 className="mb-3 font-semibold">Timeline</h3>
        <div className="relative border-l-2 border-accent/30 pl-6">
          <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-accent" />
          <p className="text-sm font-medium">Старт накоплений</p>
          <p className="text-xs text-muted-foreground">Сейчас · {formatMoney(trip.saved_amount)}</p>

          <div className="absolute -left-1.5 top-16 h-3 w-3 rounded-full bg-premium" />
          <div className="mt-10">
            <p className="text-sm font-medium">Цель: {formatMoney(trip.budget)}</p>
            <p className="text-xs text-muted-foreground">
              {plan.monthsLeft} мес. · {formatMoney(plan.monthlyNeeded)}/мес
            </p>
          </div>

          <div className="absolute -left-1.5 bottom-0 h-3 w-3 rounded-full bg-success" />
          <div className="mt-10">
            <p className="text-sm font-medium">Поездка</p>
            <p className="text-xs text-muted-foreground">{formatDate(trip.start_date, "long")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
