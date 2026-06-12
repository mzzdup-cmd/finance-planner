"use client";

import { useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalActionsSheet } from "@/components/goals/goal-actions-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";
import { useUIStore } from "@/stores/ui-store";
import { formatMoney } from "@/lib/utils";
import type { SavingsGoal } from "@/types";

export default function GoalsPage() {
  const goals = useFinanceStore((s) => s.goals);
  const addGoal = useFinanceStore((s) => s.addGoal);
  const updateGoal = useFinanceStore((s) => s.updateGoal);
  const deleteGoal = useFinanceStore((s) => s.deleteGoal);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);

  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");

  useEffect(() => {
    setHideBottomNav(!!selectedGoal || showAdd);
    return () => setHideBottomNav(false);
  }, [selectedGoal, showAdd, setHideBottomNav]);

  const active = goals.filter((g) => !g.is_completed);
  const completed = goals.filter((g) => g.is_completed);
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);
  const totalTarget = active.reduce((s, g) => s + g.target_amount, 0);

  const handleAdd = () => {
    if (!title || !target) return;
    addGoal({
      title,
      target_amount: Number(target),
      current_amount: 0,
      monthly_contribution: Number(monthly) || 0,
      deadline: null,
      color: "#00D68F",
      icon: "target",
      is_completed: false,
    });
    setTitle("");
    setTarget("");
    setMonthly("");
    setShowAdd(false);
  };

  return (
    <div>
      <AppHeader title="Цели" subtitle="Накопления и планы" showNotifications={false} />

      <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-success/20 to-accent/10 p-5">
        <p className="text-sm text-muted-foreground">Всего накоплено</p>
        <p className="text-3xl font-bold tabular-nums">{formatMoney(totalSaved)}</p>
        <p className="mt-1 text-sm text-muted-foreground">Цели на {formatMoney(totalTarget)}</p>
      </div>

      <div className="space-y-3 px-5">
        {active.length === 0 && completed.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Нет целей"
            description="Создайте цель накопления"
            actionLabel="Создать цель"
            onAction={() => setShowAdd(true)}
          />
        ) : (
          <>
            {active.map((g, i) => (
              <GoalCard key={g.id} goal={g} index={i} onClick={() => setSelectedGoal(g)} />
            ))}
            {completed.length > 0 && (
              <>
                <h3 className="pt-4 text-sm font-medium text-muted-foreground">Завершённые</h3>
                {completed.map((g, i) => (
                  <GoalCard key={g.id} goal={g} index={i} onClick={() => setSelectedGoal(g)} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      <GoalActionsSheet
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
        onDelete={deleteGoal}
        onUpdate={updateGoal}
      />

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl bg-card p-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
            <h3 className="mb-4 text-lg font-semibold">Новая цель</h3>
            <div className="space-y-3">
              <Input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Нужная сумма" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
              <Input placeholder="Ежемесячно" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Отмена</Button>
                <Button className="flex-1" onClick={handleAdd}>Создать</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedGoal && !showAdd && (
        <Button
          size="icon"
          className="fixed bottom-28 right-5 z-40 h-14 w-14 rounded-2xl shadow-xl shadow-accent/30"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
