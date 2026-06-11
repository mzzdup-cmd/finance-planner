"use client";

import { motion } from "framer-motion";
import { Check, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { cn, formatMoney, formatDate, hapticTap } from "@/lib/utils";
import { PAYMENT_CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { PaymentInstance } from "@/types";

interface PaymentItemProps {
  payment: PaymentInstance;
  onTogglePaid: (id: string) => void;
  onClick?: () => void;
  index?: number;
}

const statusConfig = {
  paid: { label: "Оплачен", variant: "success" as const, icon: Check },
  pending: { label: "Ожидает", variant: "warning" as const, icon: Clock },
  overdue: { label: "Просрочен", variant: "destructive" as const, icon: AlertTriangle },
  skipped: { label: "Пропущен", variant: "secondary" as const, icon: Clock },
};

export function PaymentItem({ payment, onTogglePaid, onClick, index = 0 }: PaymentItemProps) {
  const status = statusConfig[payment.status];
  const category = PAYMENT_CATEGORIES[payment.category];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4"
    >
      <button
        onClick={() => {
          hapticTap();
          onTogglePaid(payment.id);
        }}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all active:scale-90",
          payment.status === "paid"
            ? "bg-success text-white"
            : "border-2 border-border bg-muted/50"
        )}
      >
        {payment.status === "paid" && <Check className="h-5 w-5" strokeWidth={3} />}
      </button>

      <button onClick={onClick} className="flex flex-1 items-center gap-3 text-left">
        <div
          className="h-10 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: payment.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{payment.title}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{category.label}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(payment.due_date)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-bold tabular-nums">{formatMoney(payment.amount)}</span>
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    </motion.div>
  );
}
