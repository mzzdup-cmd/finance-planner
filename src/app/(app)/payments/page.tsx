"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PaymentSummary } from "@/components/payments/payment-summary";
import { PaymentItem } from "@/components/payments/payment-item";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";
import { useUIStore } from "@/stores/ui-store";
import { useDashboard } from "@/hooks/use-dashboard";
import { computeDashboardStats } from "@/lib/calculations";
import { MONTH_NAMES } from "@/lib/constants";
import { CreditCard } from "lucide-react";
import type { PaymentCategory, PaymentPriority } from "@/types";

const FILTERS = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Ожидают" },
  { key: "paid", label: "Оплачены" },
  { key: "overdue", label: "Просрочены" },
] as const;

export default function PaymentsPage() {
  const { monthPayments, month } = useDashboard();
  const togglePaymentPaid = useFinanceStore((s) => s.togglePaymentPaid);
  const addPayment = useFinanceStore((s) => s.addPayment);
  const filter = useUIStore((s) => s.paymentFilter);
  const setFilter = useUIStore((s) => s.setPaymentFilter);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const filtered = useMemo(() => {
    let list = [...monthPayments];
    if (filter !== "all") list = list.filter((p) => p.status === filter);
    return list.sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );
  }, [monthPayments, filter]);

  const stats = useMemo(
    () =>
      computeDashboardStats(
        useFinanceStore.getState().income,
        monthPayments,
        useFinanceStore.getState().goals
      ),
    [monthPayments]
  );

  const handleAdd = () => {
    if (!newTitle || !newAmount) return;
    const now = new Date();
    addPayment({
      payment_id: null,
      title: newTitle,
      amount: Number(newAmount),
      category: "other" as PaymentCategory,
      priority: "medium" as PaymentPriority,
      color: "#4C6EF5",
      comment: null,
      due_date: now.toISOString().split("T")[0],
      status: "pending",
      paid_at: null,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });
    setNewTitle("");
    setNewAmount("");
    setShowAdd(false);
  };

  return (
    <div>
      <AppHeader
        title="Платежи"
        subtitle={`${MONTH_NAMES[month - 1]} · ${filtered.length} шт.`}
        showNotifications={false}
      />

      <PaymentSummary
        total={stats.totalPayments}
        paid={stats.paidPayments}
        remaining={stats.remainingPayments}
        balanceAfter={stats.balanceAfterPayments}
        progress={stats.paymentProgress}
      />

      <div className="mt-5 flex gap-2 overflow-x-auto px-5 no-scrollbar">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 space-y-2 px-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Нет платежей"
            description="Добавьте обязательный платёж, чтобы отслеживать расходы"
            actionLabel="Добавить платёж"
            onAction={() => setShowAdd(true)}
          />
        ) : (
          filtered.map((p, i) => (
            <PaymentItem
              key={p.id}
              payment={p}
              onTogglePaid={togglePaymentPaid}
              index={i}
            />
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl bg-card p-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <h3 className="mb-4 text-lg font-semibold">Новый платёж</h3>
            <div className="space-y-3">
              <Input
                placeholder="Название"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Input
                placeholder="Сумма"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>
                  Отмена
                </Button>
                <Button className="flex-1" onClick={handleAdd}>
                  Добавить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        size="icon"
        className="fixed bottom-28 right-5 z-40 h-14 w-14 rounded-2xl shadow-xl shadow-accent/30"
        onClick={() => setShowAdd(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
