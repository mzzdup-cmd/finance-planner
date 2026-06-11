"use client";

import { formatMoney } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PaymentSummaryProps {
  total: number;
  paid: number;
  remaining: number;
  balanceAfter: number;
  progress: number;
}

export function PaymentSummary({
  total,
  paid,
  remaining,
  balanceAfter,
  progress,
}: PaymentSummaryProps) {
  return (
    <div className="mx-5 rounded-3xl border border-border/50 bg-card p-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Всего платежей</p>
          <p className="text-xl font-bold tabular-nums">{formatMoney(total)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Оплачено</p>
          <p className="text-xl font-bold tabular-nums text-success">{formatMoney(paid)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Осталось</p>
          <p className="text-xl font-bold tabular-nums text-warning">{formatMoney(remaining)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">После платежей</p>
          <p className={`text-xl font-bold tabular-nums ${balanceAfter >= 0 ? "text-accent" : "text-destructive"}`}>
            {formatMoney(balanceAfter)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Прогресс оплат</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>
    </div>
  );
}
