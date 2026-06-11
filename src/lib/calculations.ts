import { PAYMENT_CATEGORIES, MONTH_NAMES_SHORT } from "@/lib/constants";
import { getMonthKey } from "@/lib/utils";
import type {
  PaymentInstance,
  MonthlyIncome,
  SavingsGoal,
  DashboardStats,
  MonthlyForecast,
  CategoryBreakdown,
} from "@/types";

export function computeDashboardStats(
  income: MonthlyIncome | null,
  payments: PaymentInstance[],
  goals: SavingsGoal[]
): DashboardStats {
  const totalIncome = (income?.salary ?? 0) + (income?.extra_income ?? 0);
  const totalPayments = payments.reduce((s, p) => s + p.amount, 0);
  const paidPayments = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const remainingPayments = totalPayments - paidPayments;
  const savingsPlanned = goals
    .filter((g) => !g.is_completed)
    .reduce((s, g) => s + g.monthly_contribution, 0);

  const balanceAfterPayments = totalIncome - totalPayments;
  const balanceAfterAll = totalIncome - totalPayments - savingsPlanned;
  const paymentProgress =
    totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;

  const pending = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return {
    totalIncome,
    totalPayments,
    paidPayments,
    remainingPayments,
    savingsPlanned,
    balanceAfterPayments,
    balanceAfterAll,
    paymentProgress,
    nextPayment: pending[0] ?? null,
    overdueCount: payments.filter((p) => p.status === "overdue").length,
  };
}

export function computeCategoryBreakdown(payments: PaymentInstance[]): CategoryBreakdown[] {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const map = new Map<string, number>();

  for (const p of payments) {
    map.set(p.category, (map.get(p.category) ?? 0) + p.amount);
  }

  return Array.from(map.entries())
    .map(([category, amount]) => {
      const meta = PAYMENT_CATEGORIES[category as keyof typeof PAYMENT_CATEGORIES];
      return {
        category: category as CategoryBreakdown["category"],
        label: meta?.label ?? category,
        amount,
        color: meta?.color ?? "#ADB5BD",
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function computeMonthlyForecast(
  baseIncome: number,
  monthlyPaymentTotal: number,
  monthlySavings: number,
  monthsAhead = 6
): MonthlyForecast[] {
  const result: MonthlyForecast[] = [];
  const now = new Date();

  for (let i = 0; i < monthsAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const balance = baseIncome - monthlyPaymentTotal - monthlySavings;

    result.push({
      monthKey: getMonthKey(year, month),
      label: `${MONTH_NAMES_SHORT[month - 1]} ${year}`,
      income: baseIncome,
      expenses: monthlyPaymentTotal,
      savings: monthlySavings,
      balance,
    });
  }

  return result;
}

export function goalProgress(goal: SavingsGoal): {
  percent: number;
  remaining: number;
  onTrack: boolean;
  monthsLeft: number | null;
} {
  const percent =
    goal.target_amount > 0
      ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
      : 0;
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  if (!goal.deadline) {
    return { percent, remaining, onTrack: true, monthsLeft: null };
  }

  const deadline = new Date(goal.deadline);
  const now = new Date();
  const monthsLeft = Math.max(
    0,
    (deadline.getFullYear() - now.getFullYear()) * 12 +
      (deadline.getMonth() - now.getMonth())
  );

  const neededPerMonth = monthsLeft > 0 ? remaining / monthsLeft : remaining;
  const onTrack = goal.monthly_contribution >= neededPerMonth;

  return { percent, remaining, onTrack, monthsLeft };
}

export function tripSavingsPlan(trip: { budget: number; saved_amount: number; start_date: string }) {
  const remaining = Math.max(0, trip.budget - trip.saved_amount);
  const start = new Date(trip.start_date);
  const now = new Date();
  const monthsLeft = Math.max(
    1,
    (start.getFullYear() - now.getFullYear()) * 12 + (start.getMonth() - now.getMonth())
  );
  const monthlyNeeded = Math.ceil(remaining / monthsLeft);
  const percent = trip.budget > 0 ? Math.round((trip.saved_amount / trip.budget) * 100) : 0;

  return { remaining, monthsLeft, monthlyNeeded, percent };
}
