"use client";

import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line,
} from "recharts";
import { AppHeader } from "@/components/layout/app-header";
import { GlassCard } from "@/components/ui/glass-card";
import { CategoryChart } from "@/components/charts/category-chart";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { useDashboard } from "@/hooks/use-dashboard";
import { useFinanceStore } from "@/stores/finance-store";
import { formatCompactMoney, formatMoney } from "@/lib/utils";
import { MONTH_NAMES_SHORT } from "@/lib/constants";

export default function AnalyticsPage() {
  const { stats, categories, forecast } = useDashboard();
  const incomeHistory = useFinanceStore((s) => s.incomeHistory);

  const incomeChartData = [...incomeHistory]
    .reverse()
    .map((h) => ({
      label: `${MONTH_NAMES_SHORT[h.month - 1]}`,
      income: h.salary + h.extra_income,
      salary: h.salary,
    }));

  const expenseTrend = forecast.map((f) => ({
    label: f.label.split(" ")[0],
    expenses: f.expenses,
    savings: f.savings,
  }));

  return (
    <div>
      <AppHeader title="Аналитика" subtitle="Финансовый обзор" showBack showNotifications={false} />

      <div className="grid grid-cols-2 gap-3 px-5">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Доход</p>
          <p className="text-xl font-bold tabular-nums text-success">{formatMoney(stats.totalIncome)}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Расходы</p>
          <p className="text-xl font-bold tabular-nums text-destructive">{formatMoney(stats.totalPayments)}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Накопления</p>
          <p className="text-xl font-bold tabular-nums">{formatMoney(stats.savingsPlanned)}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Свободно</p>
          <p className="text-xl font-bold tabular-nums text-accent">{formatMoney(stats.balanceAfterAll)}</p>
        </GlassCard>
      </div>

      <div className="mt-5 px-5">
        <GlassCard>
          <h3 className="mb-4 font-semibold">Расходы по категориям</h3>
          <CategoryChart data={categories} />
        </GlassCard>
      </div>

      <div className="mt-5 px-5">
        <GlassCard>
          <h3 className="mb-4 font-semibold">Динамика доходов</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeChartData} margin={{ left: -20 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={formatCompactMoney} />
                <Tooltip formatter={(v) => formatMoney(Number(v))} />
                <Bar dataKey="income" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-5 px-5">
        <GlassCard>
          <h3 className="mb-4 font-semibold">Расходы и накопления</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expenseTrend} margin={{ left: -20 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={formatCompactMoney} />
                <Tooltip formatter={(v) => formatMoney(Number(v))} />
                <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="savings" stroke="hsl(var(--premium))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-5 px-5 pb-4">
        <GlassCard>
          <h3 className="mb-4 font-semibold">Прогноз остатка</h3>
          <ForecastChart data={forecast} />
        </GlassCard>
      </div>
    </div>
  );
}
