"use client";

import { useEffect, useState } from "react";
import { Plane, MapPin, Calendar, Wallet, Plus, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";
import { useUIStore } from "@/stores/ui-store";
import { tripSavingsPlan } from "@/lib/calculations";
import { formatMoney, formatDate } from "@/lib/utils";
import { VACATION_EXPENSE_TYPES, MONTH_NAMES } from "@/lib/constants";
import type { VacationExpense } from "@/types";

export default function VacationPage() {
  const trips = useFinanceStore((s) => s.trips);
  const expenses = useFinanceStore((s) => s.expenses);
  const tripSavings = useFinanceStore((s) => s.tripSavings);
  const tripSalaryEntries = useFinanceStore((s) => s.tripSalaryEntries);
  const updateTrip = useFinanceStore((s) => s.updateTrip);
  const addTripExpense = useFinanceStore((s) => s.addTripExpense);
  const updateTripExpense = useFinanceStore((s) => s.updateTripExpense);
  const deleteTripExpense = useFinanceStore((s) => s.deleteTripExpense);
  const addTripSaving = useFinanceStore((s) => s.addTripSaving);
  const updateTripSaving = useFinanceStore((s) => s.updateTripSaving);
  const addSavingPayment = useFinanceStore((s) => s.addSavingPayment);
  const deleteSavingPayment = useFinanceStore((s) => s.deleteSavingPayment);
  const addTripSalaryEntry = useFinanceStore((s) => s.addTripSalaryEntry);
  const updateTripSalaryEntry = useFinanceStore((s) => s.updateTripSalaryEntry);
  const deleteTripSalaryEntry = useFinanceStore((s) => s.deleteTripSalaryEntry);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);

  const trip = trips[0];
  const [selectedExpense, setSelectedExpense] = useState<VacationExpense | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expPaid, setExpPaid] = useState("");
  const [expComment, setExpComment] = useState("");
  const [expDuration, setExpDuration] = useState("");

  useEffect(() => {
    setHideBottomNav(!!selectedExpense || showAddExpense);
    return () => setHideBottomNav(false);
  }, [selectedExpense, showAddExpense, setHideBottomNav]);

  useEffect(() => {
    if (selectedExpense) {
      setExpTitle(selectedExpense.title);
      setExpAmount(String(selectedExpense.amount));
      setExpPaid(String(selectedExpense.paid_amount ?? 0));
      setExpComment(selectedExpense.comment ?? "");
      setExpDuration(selectedExpense.duration ?? "");
    }
  }, [selectedExpense]);

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
  const paidTotal = tripExpenses.reduce((s, e) => s + (e.paid_amount ?? 0), 0);
  const remainingTotal = plannedTotal - paidTotal;
  const plan = tripSavingsPlan(trip);
  const savings = tripSavings.filter((s) => s.trip_id === trip.id);
  const salaryEntries = tripSalaryEntries.filter((e) => e.trip_id === trip.id);

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const handleAddExpense = () => {
    if (!expTitle || !expAmount) return;
    addTripExpense({
      trip_id: trip.id,
      title: expTitle,
      amount: Number(expAmount),
      paid_amount: Number(expPaid) || 0,
      expense_type: "other",
      expense_date: null,
      duration: expDuration || null,
      comment: expComment || null,
      is_planned: true,
    });
    setExpTitle("");
    setExpAmount("");
    setExpPaid("");
    setExpComment("");
    setExpDuration("");
    setShowAddExpense(false);
  };

  const handleSaveExpense = () => {
    if (!selectedExpense) return;
    updateTripExpense(selectedExpense.id, {
      title: expTitle,
      amount: Number(expAmount),
      paid_amount: Number(expPaid) || 0,
      comment: expComment || null,
      duration: expDuration || null,
    });
    setSelectedExpense(null);
  };

  const handleAddSaving = () => {
    const now = new Date();
    addTripSaving({
      trip_id: trip.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      saved_amount: 0,
      payments: [],
    });
  };

  const handleAddSalaryEntry = () => {
    addTripSalaryEntry({
      trip_id: trip.id,
      label: "Зарплата",
      salary: 0,
      savings_set_aside: 0,
      other_expenses: 0,
    });
  };

  return (
    <div className="pb-8">
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

      <div className="grid grid-cols-3 gap-2 px-5">
        <GlassCard className="p-3">
          <p className="text-xs text-muted-foreground">Бюджет</p>
          <p className="text-lg font-bold tabular-nums">{formatMoney(plannedTotal)}</p>
        </GlassCard>
        <GlassCard className="p-3">
          <p className="text-xs text-muted-foreground">Оплачено</p>
          <p className="text-lg font-bold tabular-nums text-success">{formatMoney(paidTotal)}</p>
        </GlassCard>
        <GlassCard className="p-3">
          <p className="text-xs text-muted-foreground">Остаток</p>
          <p className="text-lg font-bold tabular-nums text-warning">{formatMoney(remainingTotal)}</p>
        </GlassCard>
      </div>

      <div className="mx-5 mt-5 rounded-3xl border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Накопления</span>
          <Badge variant="default">{plan.percent}%</Badge>
        </div>
        <Progress value={plan.percent} className="mt-3 h-3" />
        <div className="mt-3 flex gap-2">
          <Input
            type="number"
            className="h-9"
            placeholder="Накоплено"
            value={trip.saved_amount}
            onChange={(e) => updateTrip(trip.id, { saved_amount: Number(e.target.value) })}
          />
          <span className="self-center text-sm text-muted-foreground">из {formatMoney(trip.budget)}</span>
        </div>
      </div>

      <div className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Траты поездки</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowAddExpense(true)}>
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">Нажмите на строку, чтобы изменить</p>
        <div className="space-y-2">
          {tripExpenses.map((exp) => {
            const type = VACATION_EXPENSE_TYPES[exp.expense_type];
            const paid = exp.paid_amount ?? 0;
            const left = exp.amount - paid;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedExpense(exp)}
                className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-card p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${type.color}20`, color: type.color }}
                  >
                    <Plane className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {[exp.duration, exp.comment].filter(Boolean).join(" · ") || type.label}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular-nums">{formatMoney(exp.amount)}</p>
                  <p className="text-xs text-success">опл. {formatMoney(paid)}</p>
                  {left > 0 && <p className="text-xs text-warning">ост. {formatMoney(left)}</p>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted p-4">
          <span className="flex items-center gap-2 font-medium">
            <Wallet className="h-4 w-4" /> Итого
          </span>
          <div className="text-right">
            <span className="text-lg font-bold tabular-nums">{formatMoney(plannedTotal)}</span>
            <p className="text-xs text-muted-foreground">осталось {formatMoney(remainingTotal)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Отложено по месяцам</h3>
          <Button size="sm" variant="outline" onClick={handleAddSaving}>+ Месяц</Button>
        </div>
        {savings.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted-foreground">
            Как «Июнь отложено» в вашей таблице
          </p>
        ) : (
          savings.map((s) => {
            const spent = s.payments.reduce((sum, p) => sum + p.amount, 0);
            const left = s.saved_amount - spent;
            return (
              <div key={s.id} className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="h-9 w-32"
                    value={s.saved_amount}
                    onChange={(e) => updateTripSaving(s.id, { saved_amount: Number(e.target.value) })}
                  />
                  <span className="text-sm font-medium">
                    {MONTH_NAMES[s.month - 1]} {s.year} отложено
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Осталось от отложенного: {formatMoney(left)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Трата"
                    className="h-9 flex-1"
                    id={`pay-title-${s.id}`}
                  />
                  <Input
                    placeholder="Сумма"
                    type="number"
                    className="h-9 w-24"
                    id={`pay-amount-${s.id}`}
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      const titleEl = document.getElementById(`pay-title-${s.id}`) as HTMLInputElement;
                      const amountEl = document.getElementById(`pay-amount-${s.id}`) as HTMLInputElement;
                      if (titleEl?.value && amountEl?.value) {
                        addSavingPayment(s.id, {
                          title: titleEl.value,
                          amount: Number(amountEl.value),
                          note: null,
                        });
                        titleEl.value = "";
                        amountEl.value = "";
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {s.payments.map((p) => (
                  <div key={p.id} className="mt-2 flex items-center justify-between text-sm">
                    <span>{p.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums">{formatMoney(p.amount)}</span>
                      <button onClick={() => deleteSavingPayment(s.id, p.id)}>
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Счёт от зарплаты</h3>
          <Button size="sm" variant="outline" onClick={handleAddSalaryEntry}>+ Строка</Button>
        </div>
        {salaryEntries.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted-foreground">
            Зарплата, отложу, траты — остаток
          </p>
        ) : (
          salaryEntries.map((e) => {
            const remainFromSavings = e.savings_set_aside - e.other_expenses;
            const remainFromSalary = e.salary - e.savings_set_aside - e.other_expenses;
            return (
              <div key={e.id} className="mb-3 rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between">
                  <Input
                    className="h-9 flex-1 font-medium"
                    value={e.label}
                    onChange={(ev) => updateTripSalaryEntry(e.id, { label: ev.target.value })}
                  />
                  <button onClick={() => deleteTripSalaryEntry(e.id)}>
                    <Trash2 className="ml-2 h-4 w-4 text-destructive" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">ЗП</p>
                    <Input
                      type="number"
                      className="mt-1 h-9"
                      value={e.salary}
                      onChange={(ev) => updateTripSalaryEntry(e.id, { salary: Number(ev.target.value) })}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Отложу</p>
                    <Input
                      type="number"
                      className="mt-1 h-9"
                      value={e.savings_set_aside}
                      onChange={(ev) => updateTripSalaryEntry(e.id, { savings_set_aside: Number(ev.target.value) })}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Траты</p>
                    <Input
                      type="number"
                      className="mt-1 h-9"
                      value={e.other_expenses}
                      onChange={(ev) => updateTripSalaryEntry(e.id, { other_expenses: Number(ev.target.value) })}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Ост. от отлож.</p>
                    <p className={`font-bold tabular-nums ${remainFromSavings >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatMoney(remainFromSavings)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Ост. от ЗП</p>
                    <p className={`font-bold tabular-nums ${remainFromSalary >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatMoney(remainFromSalary)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomSheet
        open={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        title="Редактировать трату"
      >
        {selectedExpense && (
          <div className="space-y-3">
            <Input placeholder="Название" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Сумма" type="number" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
              <Input placeholder="Оплачено" type="number" value={expPaid} onChange={(e) => setExpPaid(e.target.value)} />
            </div>
            <Input placeholder="Срок (13 дней, 11ч...)" value={expDuration} onChange={(e) => setExpDuration(e.target.value)} />
            <Input placeholder="Комментарий" value={expComment} onChange={(e) => setExpComment(e.target.value)} />
            <Button className="w-full" onClick={handleSaveExpense}>Сохранить</Button>
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={() => {
                if (confirm("Удалить трату?")) {
                  deleteTripExpense(selectedExpense.id);
                  setSelectedExpense(null);
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> Удалить
            </Button>
          </div>
        )}
      </BottomSheet>

      {showAddExpense && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl bg-card p-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
            <h3 className="mb-4 text-lg font-semibold">Новая трата</h3>
            <div className="space-y-3">
              <Input placeholder="Название" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Сумма" type="number" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
                <Input placeholder="Оплачено" type="number" value={expPaid} onChange={(e) => setExpPaid(e.target.value)} />
              </div>
              <Input placeholder="Срок" value={expDuration} onChange={(e) => setExpDuration(e.target.value)} />
              <Input placeholder="Комментарий" value={expComment} onChange={(e) => setExpComment(e.target.value)} />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddExpense(false)}>Отмена</Button>
                <Button className="flex-1" onClick={handleAddExpense}>Добавить</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
