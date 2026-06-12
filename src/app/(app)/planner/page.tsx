"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";
import { formatMoney } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/constants";
import type { MonthPlan } from "@/types";

function getFutureMonths(count = 6) {
  const result: { year: number; month: number }[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }
  return result;
}

export default function PlannerPage() {
  const getOrCreateMonthPlan = useFinanceStore((s) => s.getOrCreateMonthPlan);
  const updateMonthPlan = useFinanceStore((s) => s.updateMonthPlan);
  const addPlannedExpense = useFinanceStore((s) => s.addPlannedExpense);
  const deletePlannedExpense = useFinanceStore((s) => s.deletePlannedExpense);
  const monthPlans = useFinanceStore((s) => s.monthPlans);

  const futureMonths = useMemo(() => getFutureMonths(6), []);
  const [index, setIndex] = useState(0);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const { year, month } = futureMonths[index];

  useEffect(() => {
    getOrCreateMonthPlan(year, month);
  }, [year, month, getOrCreateMonthPlan]);

  const plan: MonthPlan | undefined = monthPlans.find(
    (p) => p.year === year && p.month === month
  );

  const totalExpenses = plan?.expenses.reduce((s, e) => s + e.amount, 0) ?? 0;
  const totalIncome = (plan?.salary ?? 0) + (plan?.extra_income ?? 0);
  const balance = totalIncome - totalExpenses;

  const handleAddExpense = () => {
    if (!plan || !newExpenseTitle || !newExpenseAmount) return;
    addPlannedExpense(plan.id, { title: newExpenseTitle, amount: Number(newExpenseAmount) });
    setNewExpenseTitle("");
    setNewExpenseAmount("");
  };

  return (
    <div>
      <AppHeader
        title="Планировщик"
        subtitle="Прогноз на будущие месяцы"
        showBack
        showNotifications={false}
      />

      <div className="mx-5 mb-4 flex items-center justify-between rounded-2xl border border-border/50 bg-card p-3">
        <Button variant="ghost" size="icon" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="font-semibold">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIndex(Math.min(futureMonths.length - 1, index + 1))}
          disabled={index === futureMonths.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {plan && (
        <>
          <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <p className="text-xs text-muted-foreground">Зарплата</p>
              <Input
                type="number"
                className="mt-1 h-10 border-0 bg-muted/50 p-2 text-lg font-bold"
                value={plan.salary}
                onChange={(e) => updateMonthPlan(plan.id, { salary: Number(e.target.value) })}
              />
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <p className="text-xs text-muted-foreground">Доп. доход</p>
              <Input
                type="number"
                className="mt-1 h-10 border-0 bg-muted/50 p-2 text-lg font-bold"
                value={plan.extra_income}
                onChange={(e) => updateMonthPlan(plan.id, { extra_income: Number(e.target.value) })}
              />
            </div>
          </div>

          <div
            className={`mx-5 mb-5 rounded-3xl p-5 ${
              balance >= 0 ? "bg-success/15" : "bg-destructive/15"
            }`}
          >
            <p className="text-sm text-muted-foreground">Остаток от зарплаты</p>
            <p className={`text-3xl font-bold tabular-nums ${balance >= 0 ? "text-success" : "text-destructive"}`}>
              {formatMoney(balance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatMoney(totalIncome)} − {formatMoney(totalExpenses)} трат
            </p>
          </div>

          <div className="px-5">
            <h3 className="mb-3 font-semibold">Плановые траты</h3>
            <div className="mb-3 flex gap-2">
              <Input
                placeholder="Что оплатить"
                className="flex-1"
                value={newExpenseTitle}
                onChange={(e) => setNewExpenseTitle(e.target.value)}
              />
              <Input
                placeholder="Сумма"
                type="number"
                className="w-28"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
              />
              <Button size="icon" onClick={handleAddExpense}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {plan.expenses.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Добавьте траты — как в вашей таблице «Что оплатить»
                </p>
              ) : (
                plan.expenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4"
                  >
                    <span className="font-medium">{e.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold tabular-nums">{formatMoney(e.amount)}</span>
                      <button onClick={() => deletePlannedExpense(plan.id, e.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {plan.expenses.length > 0 && (
              <div className="mt-4 flex justify-between rounded-2xl bg-muted p-4 font-semibold">
                <span>Общая сумма</span>
                <span className="tabular-nums">{formatMoney(totalExpenses)}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
