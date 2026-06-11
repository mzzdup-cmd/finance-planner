"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BalanceHeroProps {
  balance: number;
  totalIncome: number;
  paymentProgress: number;
  paidAmount: number;
  totalPayments: number;
}

export function BalanceHero({
  balance,
  totalIncome,
  paymentProgress,
  paidAmount,
  totalPayments,
}: BalanceHeroProps) {
  const isPositive = balance >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mx-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent via-premium to-accent/80 p-6 text-white shadow-2xl shadow-accent/25"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-xl" />

      <div className="relative z-10">
        <p className="text-sm font-medium text-white/70">Остаток после платежей</p>
        <div className="mt-2 flex items-end gap-3">
          <h2 className="text-4xl font-bold tabular-nums tracking-tight">
            {formatMoney(balance)}
          </h2>
          {isPositive ? (
            <TrendingUp className="mb-1.5 h-5 w-5 text-white/80" />
          ) : (
            <TrendingDown className="mb-1.5 h-5 w-5 text-white/80" />
          )}
        </div>
        <p className="mt-1 text-sm text-white/60">
          из {formatMoney(totalIncome)} дохода
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-white/70">
            <span>Оплачено {paymentProgress}%</span>
            <span>
              {formatMoney(paidAmount)} / {formatMoney(totalPayments)}
            </span>
          </div>
          <Progress
            value={paymentProgress}
            className="h-2 bg-white/20"
            indicatorClassName="bg-white"
          />
        </div>
      </div>
    </motion.div>
  );
}
