import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Profile,
  MonthlyIncome,
  PaymentInstance,
  SavingsGoal,
  VacationTrip,
  VacationExpense,
  TripMonthlySaving,
  TripSalaryEntry,
  AppNotification,
  MonthPlan,
  PlannedExpense,
  Debt,
  DebtInstallment,
} from "@/types";
import {
  demoProfile,
  demoIncome,
  demoPayments,
  demoGoals,
  demoTrips,
  demoExpenses,
  demoNotifications,
  demoIncomeHistory,
} from "@/data/demo";
import { isDemoMode } from "@/lib/supabase/client";
import { getCurrentMonthKey, parseMonthKey } from "@/lib/utils";

interface FinanceState {
  isLoading: boolean;
  isHydrated: boolean;
  profile: Profile | null;
  selectedMonthKey: string;
  income: MonthlyIncome | null;
  incomeHistory: MonthlyIncome[];
  payments: PaymentInstance[];
  goals: SavingsGoal[];
  trips: VacationTrip[];
  expenses: VacationExpense[];
  tripSavings: TripMonthlySaving[];
  tripSalaryEntries: TripSalaryEntry[];
  notifications: AppNotification[];
  monthPlans: MonthPlan[];
  debts: Debt[];

  // Actions
  hydrate: () => Promise<void>;
  setSelectedMonth: (key: string) => void;
  setIncome: (income: Partial<MonthlyIncome>) => void;
  updateIncomeHistory: (id: string, data: Partial<MonthlyIncome>) => void;
  deleteIncomeHistory: (id: string) => void;
  addIncomeHistory: (data: Omit<MonthlyIncome, "id" | "user_id">) => void;
  togglePaymentPaid: (id: string) => void;
  addPayment: (payment: Omit<PaymentInstance, "id" | "user_id">) => void;
  updatePayment: (id: string, data: Partial<PaymentInstance>) => void;
  deletePayment: (id: string) => void;
  postponePayment: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, "id" | "user_id">) => void;
  updateGoal: (id: string, data: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  completeOnboarding: () => void;
  getOrCreateMonthPlan: (year: number, month: number) => MonthPlan;
  updateMonthPlan: (id: string, data: Partial<MonthPlan>) => void;
  addPlannedExpense: (planId: string, expense: Omit<PlannedExpense, "id">) => void;
  updatePlannedExpense: (planId: string, expenseId: string, data: Partial<PlannedExpense>) => void;
  deletePlannedExpense: (planId: string, expenseId: string) => void;
  addDebt: (debt: Omit<Debt, "id">) => void;
  updateDebt: (id: string, data: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addDebtInstallment: (debtId: string, inst: Omit<DebtInstallment, "id">) => void;
  updateDebtInstallment: (debtId: string, instId: string, data: Partial<DebtInstallment>) => void;
  deleteDebtInstallment: (debtId: string, instId: string) => void;
  toggleDebtInstallmentPaid: (debtId: string, instId: string) => void;
  splitDebtIntoFour: (debtId: string, startDate: string) => void;
  updateTrip: (id: string, data: Partial<VacationTrip>) => void;
  addTripExpense: (expense: Omit<VacationExpense, "id" | "user_id">) => void;
  updateTripExpense: (id: string, data: Partial<VacationExpense>) => void;
  deleteTripExpense: (id: string) => void;
  addTripSaving: (saving: Omit<TripMonthlySaving, "id">) => void;
  updateTripSaving: (id: string, data: Partial<TripMonthlySaving>) => void;
  deleteTripSaving: (id: string) => void;
  addSavingPayment: (savingId: string, payment: { title: string; amount: number; note: string | null }) => void;
  deleteSavingPayment: (savingId: string, paymentId: string) => void;
  addTripSalaryEntry: (entry: Omit<TripSalaryEntry, "id">) => void;
  updateTripSalaryEntry: (id: string, data: Partial<TripSalaryEntry>) => void;
  deleteTripSalaryEntry: (id: string) => void;
}

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isHydrated: false,
      profile: null,
      selectedMonthKey: getCurrentMonthKey(),
      income: null,
      incomeHistory: [],
      payments: [],
      goals: [],
      trips: [],
      expenses: [],
      tripSavings: [],
      tripSalaryEntries: [],
      notifications: [],
      monthPlans: [],
      debts: [],

      hydrate: async () => {
        if (get().isHydrated) return;
        set({ isLoading: true });

        const state = get();

        // Уже есть сохранённые данные — не затираем демо при каждом обновлении
        if (state.payments.length > 0 || state.profile) {
          set({ isHydrated: true, isLoading: false });
          return;
        }

        // Первый визит — загружаем демо-данные
        const seed = {
          profile: demoProfile,
          income: demoIncome,
          incomeHistory: demoIncomeHistory,
          payments: demoPayments,
          goals: demoGoals,
          trips: demoTrips,
          expenses: demoExpenses,
          notifications: demoNotifications,
        };

        if (!isDemoMode()) {
          // TODO: загрузка из Supabase для авторизованных пользователей
        }

        set({ ...seed, isHydrated: true, isLoading: false });
      },

      setSelectedMonth: (key) => set({ selectedMonthKey: key }),

      setIncome: (data) => {
        const current = get().income;
        if (!current) return;
        const updated = { ...current, ...data };
        set({ income: updated });
        set((s) => ({
          incomeHistory: s.incomeHistory.map((h) =>
            h.year === updated.year && h.month === updated.month ? updated : h
          ),
        }));
      },

      updateIncomeHistory: (id, data) => {
        set((s) => ({
          incomeHistory: s.incomeHistory.map((h) => (h.id === id ? { ...h, ...data } : h)),
        }));
        const entry = get().incomeHistory.find((h) => h.id === id);
        const income = get().income;
        if (entry && income && entry.year === income.year && entry.month === income.month) {
          set({ income: { ...income, ...data } });
        }
      },

      deleteIncomeHistory: (id) => {
        set((s) => ({ incomeHistory: s.incomeHistory.filter((h) => h.id !== id) }));
      },

      addIncomeHistory: (data) => {
        const entry: MonthlyIncome = {
          ...data,
          id: generateId(),
          user_id: get().profile?.id ?? "local",
        };
        set((s) => ({
          incomeHistory: [entry, ...s.incomeHistory].sort(
            (a, b) => b.year * 12 + b.month - (a.year * 12 + a.month)
          ),
        }));
      },

      togglePaymentPaid: (id) => {
        set((s) => ({
          payments: s.payments.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: p.status === "paid" ? "pending" : "paid",
                  paid_at: p.status === "paid" ? null : new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      addPayment: (payment) => {
        const { year, month } = parseMonthKey(get().selectedMonthKey);
        const newPayment: PaymentInstance = {
          ...payment,
          id: generateId(),
          user_id: get().profile?.id ?? "local",
          year,
          month,
        };
        set((s) => ({ payments: [...s.payments, newPayment] }));
      },

      updatePayment: (id, data) => {
        set((s) => ({
          payments: s.payments.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },

      deletePayment: (id) => {
        set((s) => ({ payments: s.payments.filter((p) => p.id !== id) }));
      },

      postponePayment: (id) => {
        const payment = get().payments.find((p) => p.id === id);
        if (!payment) return;
        const due = new Date(payment.due_date);
        due.setMonth(due.getMonth() + 1);
        const newMonth = due.getMonth() + 1;
        const newYear = due.getFullYear();
        set((s) => ({
          payments: s.payments.map((p) =>
            p.id === id
              ? {
                  ...p,
                  due_date: due.toISOString().split("T")[0],
                  month: newMonth,
                  year: newYear,
                  status: "pending" as const,
                }
              : p
          ),
        }));
      },

      addGoal: (goal) => {
        const newGoal: SavingsGoal = {
          ...goal,
          id: generateId(),
          user_id: get().profile?.id ?? "local",
        };
        set((s) => ({ goals: [...s.goals, newGoal] }));
      },

      updateGoal: (id, data) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        }));
      },

      deleteGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
      },

      markNotificationRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
        }));
      },

      completeOnboarding: () => {
        set((s) => ({
          profile: s.profile ? { ...s.profile, onboarding_completed: true } : null,
        }));
      },

      getOrCreateMonthPlan: (year, month) => {
        const existing = get().monthPlans.find((p) => p.year === year && p.month === month);
        if (existing) return existing;
        const plan: MonthPlan = {
          id: generateId(),
          year,
          month,
          salary: get().income?.salary ?? 0,
          extra_income: 0,
          expenses: [],
          note: null,
        };
        set((s) => ({ monthPlans: [...s.monthPlans, plan] }));
        return plan;
      },

      updateMonthPlan: (id, data) => {
        set((s) => ({
          monthPlans: s.monthPlans.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },

      addPlannedExpense: (planId, expense) => {
        const item: PlannedExpense = { ...expense, id: generateId() };
        set((s) => ({
          monthPlans: s.monthPlans.map((p) =>
            p.id === planId ? { ...p, expenses: [...p.expenses, item] } : p
          ),
        }));
      },

      updatePlannedExpense: (planId, expenseId, data) => {
        set((s) => ({
          monthPlans: s.monthPlans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  expenses: p.expenses.map((e) =>
                    e.id === expenseId ? { ...e, ...data } : e
                  ),
                }
              : p
          ),
        }));
      },

      deletePlannedExpense: (planId, expenseId) => {
        set((s) => ({
          monthPlans: s.monthPlans.map((p) =>
            p.id === planId
              ? { ...p, expenses: p.expenses.filter((e) => e.id !== expenseId) }
              : p
          ),
        }));
      },

      addDebt: (debt) => {
        const item: Debt = { ...debt, id: generateId() };
        set((s) => ({ debts: [...s.debts, item] }));
      },

      updateDebt: (id, data) => {
        set((s) => ({
          debts: s.debts.map((d) => (d.id === id ? { ...d, ...data } : d)),
        }));
      },

      deleteDebt: (id) => {
        set((s) => ({ debts: s.debts.filter((d) => d.id !== id) }));
      },

      addDebtInstallment: (debtId, inst) => {
        const item: DebtInstallment = { ...inst, id: generateId() };
        set((s) => ({
          debts: s.debts.map((d) => {
            if (d.id !== debtId) return d;
            const installments = [...d.installments, item];
            const remaining = installments
              .filter((i) => !i.is_paid)
              .reduce((sum, i) => sum + i.amount, 0);
            return { ...d, installments, remaining_amount: remaining };
          }),
        }));
      },

      updateDebtInstallment: (debtId, instId, data) => {
        set((s) => ({
          debts: s.debts.map((d) =>
            d.id === debtId
              ? {
                  ...d,
                  installments: d.installments.map((i) =>
                    i.id === instId ? { ...i, ...data } : i
                  ),
                }
              : d
          ),
        }));
      },

      deleteDebtInstallment: (debtId, instId) => {
        set((s) => ({
          debts: s.debts.map((d) => {
            if (d.id !== debtId) return d;
            const installments = d.installments.filter((i) => i.id !== instId);
            const remaining = installments
              .filter((i) => !i.is_paid)
              .reduce((sum, i) => sum + i.amount, 0);
            return { ...d, installments, remaining_amount: remaining };
          }),
        }));
      },

      toggleDebtInstallmentPaid: (debtId, instId) => {
        set((s) => ({
          debts: s.debts.map((d) => {
            if (d.id !== debtId) return d;
            const installments = d.installments.map((i) =>
              i.id === instId ? { ...i, is_paid: !i.is_paid } : i
            );
            const remaining = installments
              .filter((i) => !i.is_paid)
              .reduce((sum, i) => sum + i.amount, 0);
            return { ...d, installments, remaining_amount: remaining };
          }),
        }));
      },

      splitDebtIntoFour: (debtId, startDate) => {
        const debt = get().debts.find((d) => d.id === debtId);
        if (!debt) return;
        const part = Math.round(debt.remaining_amount / 4);
        const start = new Date(startDate);
        const installments: DebtInstallment[] = [];
        for (let i = 0; i < 4; i++) {
          const due = new Date(start);
          due.setDate(due.getDate() + i * 14);
          installments.push({
            id: generateId(),
            due_date: due.toISOString().split("T")[0],
            amount: i === 3 ? debt.remaining_amount - part * 3 : part,
            is_paid: false,
          });
        }
        set((s) => ({
          debts: s.debts.map((d) =>
            d.id === debtId ? { ...d, installments: [...d.installments, ...installments] } : d
          ),
        }));
      },

      updateTrip: (id, data) => {
        set((s) => ({
          trips: s.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      addTripExpense: (expense) => {
        const item: VacationExpense = {
          ...expense,
          id: generateId(),
          user_id: get().profile?.id ?? "local",
        };
        set((s) => ({ expenses: [...s.expenses, item] }));
      },

      updateTripExpense: (id, data) => {
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
        }));
      },

      deleteTripExpense: (id) => {
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
      },

      addTripSaving: (saving) => {
        const item: TripMonthlySaving = { ...saving, id: generateId() };
        set((s) => ({ tripSavings: [...s.tripSavings, item] }));
      },

      updateTripSaving: (id, data) => {
        set((s) => ({
          tripSavings: s.tripSavings.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      deleteTripSaving: (id) => {
        set((s) => ({ tripSavings: s.tripSavings.filter((t) => t.id !== id) }));
      },

      addSavingPayment: (savingId, payment) => {
        const item = { ...payment, id: generateId() };
        set((s) => ({
          tripSavings: s.tripSavings.map((t) =>
            t.id === savingId ? { ...t, payments: [...t.payments, item] } : t
          ),
        }));
      },

      deleteSavingPayment: (savingId, paymentId) => {
        set((s) => ({
          tripSavings: s.tripSavings.map((t) =>
            t.id === savingId
              ? { ...t, payments: t.payments.filter((p) => p.id !== paymentId) }
              : t
          ),
        }));
      },

      addTripSalaryEntry: (entry) => {
        const item: TripSalaryEntry = { ...entry, id: generateId() };
        set((s) => ({ tripSalaryEntries: [...s.tripSalaryEntries, item] }));
      },

      updateTripSalaryEntry: (id, data) => {
        set((s) => ({
          tripSalaryEntries: s.tripSalaryEntries.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));
      },

      deleteTripSalaryEntry: (id) => {
        set((s) => ({ tripSalaryEntries: s.tripSalaryEntries.filter((e) => e.id !== id) }));
      },
    }),
    {
      name: "finance-planner-store-v4",
      partialize: (s) => ({
        profile: s.profile,
        selectedMonthKey: s.selectedMonthKey,
        income: s.income,
        incomeHistory: s.incomeHistory,
        payments: s.payments,
        goals: s.goals,
        trips: s.trips,
        expenses: s.expenses,
        tripSavings: s.tripSavings,
        tripSalaryEntries: s.tripSalaryEntries,
        notifications: s.notifications,
        monthPlans: s.monthPlans,
        debts: s.debts,
      }),
    }
  )
);
