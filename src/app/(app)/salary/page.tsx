"use client";

import { useState } from "react";
import { Wallet, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatMoney } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/constants";

export default function SalaryPage() {
  const income = useFinanceStore((s) => s.income);
  const incomeHistory = useFinanceStore((s) => s.incomeHistory);
  const setIncome = useFinanceStore((s) => s.setIncome);
  const { stats } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [salary, setSalary] = useState(String(income?.salary ?? 0));
  const [extra, setExtra] = useState(String(income?.extra_income ?? 0));

  const handleSave = () => {
    setIncome({ salary: Number(salary), extra_income: Number(extra) });
    setEditing(false);
  };

  return (
    <div>
      <AppHeader title="Зарплата" subtitle="Доходы и история" showBack showNotifications={false} />

      <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-premium/30 to-accent/20 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/70">Доход за месяц</p>
            <p className="text-3xl font-bold tabular-nums text-white">
              {formatMoney(stats.totalIncome)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs text-white/60">Зарплата</p>
            <p className="font-bold tabular-nums text-white">{formatMoney(income?.salary ?? 0)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs text-white/60">Доп. доход</p>
            <p className="font-bold tabular-nums text-white">{formatMoney(income?.extra_income ?? 0)}</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-5 rounded-3xl border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Остаток после всего</h3>
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
        <p className={`mt-2 text-2xl font-bold tabular-nums ${stats.balanceAfterAll >= 0 ? "text-success" : "text-destructive"}`}>
          {formatMoney(stats.balanceAfterAll)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Доход − платежи − накопления
        </p>
      </div>

      {editing ? (
        <div className="mx-5 space-y-3 rounded-3xl border border-border/50 bg-card p-5">
          <h3 className="font-semibold">Редактировать доход</h3>
          <Input placeholder="Зарплата" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          <Input placeholder="Доп. доход" type="number" value={extra} onChange={(e) => setExtra(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Отмена</Button>
            <Button className="flex-1" onClick={handleSave}>Сохранить</Button>
          </div>
        </div>
      ) : (
        <div className="px-5">
          <Button onClick={() => setEditing(true)} className="w-full">
            Изменить доход
          </Button>
        </div>
      )}

      <div className="mt-6 px-5">
        <h3 className="mb-3 font-semibold">История</h3>
        <div className="space-y-2">
          {incomeHistory.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4"
            >
              <span className="font-medium">
                {MONTH_NAMES[h.month - 1]} {h.year}
              </span>
              <div className="text-right">
                <p className="font-bold tabular-nums">
                  {formatMoney(h.salary + h.extra_income)}
                </p>
                {h.extra_income > 0 && (
                  <p className="text-xs text-muted-foreground">
                    +{formatMoney(h.extra_income)} доп.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
