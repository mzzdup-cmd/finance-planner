"use client";

import { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney, hapticTap } from "@/lib/utils";
import type { SavingsGoal } from "@/types";

interface GoalActionsSheetProps {
  goal: SavingsGoal | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<SavingsGoal>) => void;
}

export function GoalActionsSheet({ goal, onClose, onDelete, onUpdate }: GoalActionsSheetProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [monthly, setMonthly] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTarget(String(goal.target_amount));
      setCurrent(String(goal.current_amount));
      setMonthly(String(goal.monthly_contribution));
      setEditing(false);
    }
  }, [goal]);

  if (!goal) return null;

  const handleSave = () => {
    onUpdate(goal.id, {
      title,
      target_amount: Number(target),
      current_amount: Number(current),
      monthly_contribution: Number(monthly),
      is_completed: Number(current) >= Number(target),
    });
    hapticTap();
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Удалить цель «${goal.title}»?`)) {
      hapticTap();
      onDelete(goal.id);
      onClose();
    }
  };

  return (
    <BottomSheet open={!!goal} onClose={onClose} title={editing ? "Редактировать" : goal.title}>
      {editing ? (
        <div className="space-y-3">
          <Input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Нужная сумма" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
          <Input placeholder="Уже накоплено" type="number" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <Input placeholder="В месяц" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Назад</Button>
            <Button className="flex-1" onClick={handleSave}>Сохранить</Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-1 text-2xl font-bold tabular-nums">{formatMoney(goal.current_amount)}</p>
          <p className="mb-5 text-sm text-muted-foreground">из {formatMoney(goal.target_amount)}</p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full gap-2" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" /> Редактировать
            </Button>
            <Button variant="destructive" className="w-full gap-2" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Удалить цель
            </Button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
