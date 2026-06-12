"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Pencil, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";
import { useUIStore } from "@/stores/ui-store";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatMoney } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/constants";
import type { MonthlyIncome } from "@/types";

export default function SalaryPage() {
  const income = useFinanceStore((s) => s.income);
  const incomeHistory = useFinanceStore((s) => s.incomeHistory);
  const setIncome = useFinanceStore((s) => s.setIncome);
  const updateIncomeHistory = useFinanceStore((s) => s.updateIncomeHistory);
  const deleteIncomeHistory = useFinanceStore((s) => s.deleteIncomeHistory);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);
  const { stats } = useDashboard();

  const [editing, setEditing] = useState(false);
  const [salary, setSalary] = useState(String(income?.salary ?? 0));
  const [extra, setExtra] = useState(String(income?.extra_income ?? 0));
  const [selectedHistory, setSelectedHistory] = useState<MonthlyIncome | null>(null);
  const [histSalary, setHistSalary] = useState("");
  const [histExtra, setHistExtra] = useState("");

  useEffect(() => {
    setHideBottomNav(editing || !!selectedHistory);
    return () => setHideBottomNav(false);
  }, [editing, selectedHistory, setHideBottomNav]);

  useEffect(() => {
    if (selectedHistory) {
      setHistSalary(String(selectedHistory.salary));
      setHistExtra(String(selectedHistory.extra_income));
    }
  }, [selectedHistory]);

  const handleSave = () => {
    setIncome({ salary: Number(salary), extra_income: Number(extra) });
    setEditing(false);
  };

  const handleSaveHistory = () => {
    if (!selectedHistory) return;
    updateIncomeHistory(selectedHistory.id, {
      salary: Number(histSalary),
      extra_income: Number(histExtra),
    });
    setSelectedHistory(null);
  };

  const handleDeleteHistory = () => {
    if (!selectedHistory) return;
    if (confirm(`Удалить запись за ${MONTH_NAMES[selectedHistory.month - 1]}?`)) {
      deleteIncomeHistory(selectedHistory.id);
      setSelectedHistory(null);
    }
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
      </div>

      {editing ? (
        <div className="mx-5 space-y-3 rounded-3xl border border-border/50 bg-card p-5">
          <h3 className="font-semibold">Текущий месяц</h3>
          <Input placeholder="Зарплата" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          <Input placeholder="Доп. доход" type="number" value={extra} onChange={(e) => setExtra(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Отмена</Button>
            <Button className="flex-1" onClick={handleSave}>Сохранить</Button>
          </div>
        </div>
      ) : (
        <div className="px-5">
          <Button onClick={() => setEditing(true)} className="w-full">Изменить доход</Button>
        </div>
      )}

      <div className="mt-6 px-5 pb-4">
        <h3 className="mb-3 font-semibold">История</h3>
        <p className="mb-3 text-xs text-muted-foreground">Нажмите на месяц, чтобы изменить или удалить</p>
        <div className="space-y-2">
          {incomeHistory.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHistory(h)}
              className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-card p-4 text-left"
            >
              <span className="font-medium">{MONTH_NAMES[h.month - 1]} {h.year}</span>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <p className="font-bold tabular-nums">{formatMoney(h.salary + h.extra_income)}</p>
                  {h.extra_income > 0 && (
                    <p className="text-xs text-muted-foreground">+{formatMoney(h.extra_income)} доп.</p>
                  )}
                </div>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomSheet
        open={!!selectedHistory}
        onClose={() => setSelectedHistory(null)}
        title={selectedHistory ? `${MONTH_NAMES[selectedHistory.month - 1]} ${selectedHistory.year}` : ""}
      >
        {selectedHistory && (
          <div className="space-y-3">
            <Input placeholder="Зарплата" type="number" value={histSalary} onChange={(e) => setHistSalary(e.target.value)} />
            <Input placeholder="Доп. доход" type="number" value={histExtra} onChange={(e) => setHistExtra(e.target.value)} />
            <Button className="w-full" onClick={handleSaveHistory}>Сохранить</Button>
            <Button variant="destructive" className="w-full gap-2" onClick={handleDeleteHistory}>
              <Trash2 className="h-4 w-4" /> Удалить запись
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
