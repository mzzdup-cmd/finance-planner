"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Check, Landmark } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { useFinanceStore } from "@/stores/finance-store";
import { useUIStore } from "@/stores/ui-store";
import { formatMoney, formatDate } from "@/lib/utils";

export default function DebtsPage() {
  const debts = useFinanceStore((s) => s.debts);
  const addDebt = useFinanceStore((s) => s.addDebt);
  const deleteDebt = useFinanceStore((s) => s.deleteDebt);
  const addDebtInstallment = useFinanceStore((s) => s.addDebtInstallment);
  const deleteDebtInstallment = useFinanceStore((s) => s.deleteDebtInstallment);
  const toggleDebtInstallmentPaid = useFinanceStore((s) => s.toggleDebtInstallmentPaid);
  const splitDebtIntoFour = useFinanceStore((s) => s.splitDebtIntoFour);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [instDate, setInstDate] = useState("");
  const [instAmount, setInstAmount] = useState("");
  const [splitDate, setSplitDate] = useState("");

  const selected = debts.find((d) => d.id === selectedId);

  useEffect(() => {
    setHideBottomNav(showAdd || !!selectedId);
    return () => setHideBottomNav(false);
  }, [showAdd, selectedId, setHideBottomNav]);

  const handleAddDebt = () => {
    if (!title || !total) return;
    const amount = Number(total);
    addDebt({
      title,
      total_amount: amount,
      remaining_amount: amount,
      color: "#FA5252",
      installments: [],
    });
    setTitle("");
    setTotal("");
    setShowAdd(false);
  };

  const handleAddInstallment = () => {
    if (!selected || !instDate || !instAmount) return;
    addDebtInstallment(selected.id, {
      due_date: instDate,
      amount: Number(instAmount),
      is_paid: false,
    });
    setInstDate("");
    setInstAmount("");
  };

  const totalDebt = debts.reduce((s, d) => s + d.remaining_amount, 0);

  return (
    <div>
      <AppHeader title="Долги" subtitle="Рассрочки и кредиты" showBack showNotifications={false} />

      <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-destructive/20 to-warning/10 p-5">
        <p className="text-sm text-muted-foreground">Осталось выплатить</p>
        <p className="text-3xl font-bold tabular-nums text-destructive">{formatMoney(totalDebt)}</p>
      </div>

      {!selected ? (
        <div className="space-y-3 px-5">
          {debts.length === 0 ? (
            <EmptyState
              icon={Landmark}
              title="Нет долгов"
              description="Добавьте Долями, кредит или другую рассрочку"
              actionLabel="Добавить долг"
              onAction={() => setShowAdd(true)}
            />
          ) : (
            debts.map((d) => {
              const paid = d.total_amount - d.remaining_amount;
              const percent = d.total_amount > 0 ? Math.round((paid / d.total_amount) * 100) : 0;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className="w-full rounded-3xl border border-border/50 bg-card p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{d.title}</h3>
                    <span className="font-bold tabular-nums text-destructive">
                      {formatMoney(d.remaining_amount)}
                    </span>
                  </div>
                  <Progress value={percent} className="mt-3 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {d.installments.length} платежей · {percent}% выплачено
                  </p>
                </button>
              );
            })
          )}
        </div>
      ) : (
        <div className="px-5">
          <Button variant="ghost" className="mb-3" onClick={() => setSelectedId(null)}>
            ← Назад к списку
          </Button>

          <div className="mb-4 rounded-3xl border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => { deleteDebt(selected.id); setSelectedId(null); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Всего {formatMoney(selected.total_amount)} · Осталось {formatMoney(selected.remaining_amount)}
            </p>
          </div>

          <h3 className="mb-3 font-semibold">График платежей</h3>
          <div className="mb-3 rounded-2xl bg-muted/50 p-3">
            <p className="mb-2 text-xs text-muted-foreground">Долями — 4 платежа раз в 2 недели</p>
            <div className="flex gap-2">
              <Input type="date" className="flex-1" value={splitDate} onChange={(e) => setSplitDate(e.target.value)} />
              <Button
                variant="outline"
                disabled={!splitDate}
                onClick={() => {
                  splitDebtIntoFour(selected.id, splitDate);
                  setSplitDate("");
                }}
              >
                Разбить на 4
              </Button>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Input type="date" className="flex-1" value={instDate} onChange={(e) => setInstDate(e.target.value)} />
            <Input type="number" placeholder="Сумма" className="w-28" value={instAmount} onChange={(e) => setInstAmount(e.target.value)} />
            <Button size="icon" onClick={handleAddInstallment}><Plus className="h-5 w-5" /></Button>
          </div>

          <div className="space-y-2">
            {selected.installments
              .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
              .map((inst) => (
                <div key={inst.id} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4">
                  <button
                    onClick={() => toggleDebtInstallmentPaid(selected.id, inst.id)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      inst.is_paid ? "bg-success text-white" : "border-2 border-border"
                    }`}
                  >
                    {inst.is_paid && <Check className="h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium">{formatDate(inst.due_date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {inst.is_paid ? "Оплачен" : "Ожидает"}
                    </p>
                  </div>
                  <span className="font-bold tabular-nums">{formatMoney(inst.amount)}</span>
                  <button onClick={() => deleteDebtInstallment(selected.id, inst.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl bg-card p-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
            <h3 className="mb-4 text-lg font-semibold">Новый долг</h3>
            <div className="space-y-3">
              <Input placeholder="Название (Долями, кредит...)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Общая сумма" type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Отмена</Button>
                <Button className="flex-1" onClick={handleAddDebt}>Добавить</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selected && !showAdd && (
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
