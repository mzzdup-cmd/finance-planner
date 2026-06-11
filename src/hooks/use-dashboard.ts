"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/stores/finance-store";
import {
  computeDashboardStats,
  computeCategoryBreakdown,
  computeMonthlyForecast,
} from "@/lib/calculations";
import { parseMonthKey } from "@/lib/utils";

export function useDashboard() {
  const income = useFinanceStore((s) => s.income);
  const payments = useFinanceStore((s) => s.payments);
  const goals = useFinanceStore((s) => s.goals);
  const selectedMonthKey = useFinanceStore((s) => s.selectedMonthKey);
  const profile = useFinanceStore((s) => s.profile);

  const { year, month } = parseMonthKey(selectedMonthKey);

  const monthPayments = useMemo(
    () => payments.filter((p) => p.year === year && p.month === month),
    [payments, year, month]
  );

  const stats = useMemo(
    () => computeDashboardStats(income, monthPayments, goals),
    [income, monthPayments, goals]
  );

  const categories = useMemo(
    () => computeCategoryBreakdown(monthPayments),
    [monthPayments]
  );

  const forecast = useMemo(
    () =>
      computeMonthlyForecast(
        stats.totalIncome,
        stats.totalPayments,
        stats.savingsPlanned
      ),
    [stats]
  );

  const upcomingPayments = useMemo(
    () =>
      monthPayments
        .filter((p) => p.status !== "paid")
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        .slice(0, 5),
    [monthPayments]
  );

  const activeGoals = useMemo(
    () => goals.filter((g) => !g.is_completed),
    [goals]
  );

  const vacationGoal = useMemo(
    () => goals.find((g) => g.icon === "plane" && !g.is_completed),
    [goals]
  );

  return {
    profile,
    stats,
    categories,
    forecast,
    upcomingPayments,
    activeGoals,
    vacationGoal,
    monthPayments,
    selectedMonthKey,
    year,
    month,
  };
}
