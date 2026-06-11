"use client";

import Link from "next/link";
import { Wallet, CreditCard, Target, Plane, Clock, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { BalanceHero } from "@/components/cards/balance-hero";
import { StatCard } from "@/components/cards/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { CategoryChart } from "@/components/charts/category-chart";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { PaymentItem } from "@/components/payments/payment-item";
import { SectionTitle } from "@/components/shared/section-title";
import { useDashboard } from "@/hooks/use-dashboard";
import { useFinanceStore } from "@/stores/finance-store";
import { formatMoney, formatDate } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/constants";

export default function DashboardPage() {
  const { stats, categories, forecast, upcomingPayments, vacationGoal, month } =
    useDashboard();
  const togglePaymentPaid = useFinanceStore((s) => s.togglePaymentPaid);

  return (
    <div className="animate-fade-in">
      <AppHeader title="Главная" subtitle={`${MONTH_NAMES[month - 1]} ${new Date().getFullYear()}`} />

      <div className="space-y-5">
        <BalanceHero
          balance={stats.balanceAfterPayments}
          totalIncome={stats.totalIncome}
          paymentProgress={stats.paymentProgress}
          paidAmount={stats.paidPayments}
          totalPayments={stats.totalPayments}
        />

        <div className="grid grid-cols-2 gap-3 px-5">
          <StatCard
            title="Обязательные"
            amount={stats.totalPayments}
            subtitle={`${stats.paymentProgress}% оплачено`}
            icon={CreditCard}
            variant="accent"
            delay={0.1}
          />
          <StatCard
            title="Накопления"
            amount={stats.savingsPlanned}
            subtitle="в этом месяце"
            icon={Target}
            variant="success"
            delay={0.15}
          />
          <StatCard
            title="Свободно"
            amount={stats.balanceAfterAll}
            subtitle="после всего"
            icon={Wallet}
            variant={stats.balanceAfterAll >= 0 ? "default" : "destructive"}
            delay={0.2}
          />
          <StatCard
            title="Отпуск"
            amount={vacationGoal?.current_amount ?? 0}
            subtitle={vacationGoal ? `${Math.round((vacationGoal.current_amount / vacationGoal.target_amount) * 100)}% цели` : "не задано"}
            icon={Plane}
            variant="accent"
            delay={0.25}
          />
        </div>

        {stats.nextPayment && (
          <div className="px-5">
            <GlassCard gradient="#4C6EF5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-premium/20">
                    <Clock className="h-5 w-5 text-premium" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Следующий платёж</p>
                    <p className="font-semibold">{stats.nextPayment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(stats.nextPayment.due_date)} · {formatMoney(stats.nextPayment.amount)}
                    </p>
                  </div>
                </div>
                <Link href="/payments">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </GlassCard>
          </div>
        )}

        <div>
          <SectionTitle
            title="Ближайшие платежи"
            action={
              <Link href="/payments" className="text-sm font-medium text-accent">
                Все
              </Link>
            }
          />
          <div className="space-y-2 px-5">
            {upcomingPayments.map((p, i) => (
              <PaymentItem
                key={p.id}
                payment={p}
                onTogglePaid={togglePaymentPaid}
                index={i}
              />
            ))}
          </div>
        </div>

        <div className="px-5">
          <GlassCard delay={0.3}>
            <h3 className="mb-4 font-semibold">Расходы по категориям</h3>
            <CategoryChart data={categories} />
          </GlassCard>
        </div>

        <div className="px-5 pb-4">
          <GlassCard delay={0.35}>
            <h3 className="mb-4 font-semibold">Прогноз остатка</h3>
            <ForecastChart data={forecast} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
