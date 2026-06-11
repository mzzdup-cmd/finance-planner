"use client";

import { Trash2, CalendarClock, X } from "lucide-react";
import { formatMoney, formatDate, hapticTap } from "@/lib/utils";
import { PAYMENT_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PaymentInstance } from "@/types";

interface PaymentActionsSheetProps {
  payment: PaymentInstance | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onPostpone: (id: string) => void;
}

export function PaymentActionsSheet({
  payment,
  onClose,
  onDelete,
  onPostpone,
}: PaymentActionsSheetProps) {
  if (!payment) return null;

  const category = PAYMENT_CATEGORIES[payment.category];

  const handleDelete = () => {
    hapticTap();
    if (confirm(`Удалить «${payment.title}»?`)) {
      onDelete(payment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-card p-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{payment.title}</h3>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatMoney(payment.amount)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.label} · {formatDate(payment.due_date)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Badge variant="secondary" className="mb-5">
          {payment.status === "paid" ? "Оплачен" : payment.status === "overdue" ? "Просрочен" : "Ожидает"}
        </Badge>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              hapticTap();
              onPostpone(payment.id);
              onClose();
            }}
          >
            <CalendarClock className="h-4 w-4" />
            Перенести на следующий месяц
          </Button>

          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Удалить платёж
          </Button>
        </div>
      </div>
    </div>
  );
}
