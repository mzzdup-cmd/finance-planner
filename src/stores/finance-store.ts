import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Profile,
  MonthlyIncome,
  PaymentInstance,
  SavingsGoal,
  VacationTrip,
  VacationExpense,
  AppNotification,
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
  notifications: AppNotification[];

  // Actions
  hydrate: () => Promise<void>;
  setSelectedMonth: (key: string) => void;
  setIncome: (income: Partial<MonthlyIncome>) => void;
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
      notifications: [],

      hydrate: async () => {
        if (get().isHydrated) return;
        set({ isLoading: true });

        if (isDemoMode()) {
          set({
            profile: demoProfile,
            income: demoIncome,
            incomeHistory: demoIncomeHistory,
            payments: demoPayments,
            goals: demoGoals,
            trips: demoTrips,
            expenses: demoExpenses,
            notifications: demoNotifications,
            isHydrated: true,
            isLoading: false,
          });
          return;
        }

        // Supabase hydration would go here
        set({
          profile: demoProfile,
          income: demoIncome,
          incomeHistory: demoIncomeHistory,
          payments: demoPayments,
          goals: demoGoals,
          trips: demoTrips,
          expenses: demoExpenses,
          notifications: demoNotifications,
          isHydrated: true,
          isLoading: false,
        });
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
    }),
    {
      name: "finance-planner-store-v2",
      partialize: (s) => ({
        profile: s.profile,
        selectedMonthKey: s.selectedMonthKey,
        income: s.income,
        payments: s.payments,
        goals: s.goals,
        trips: s.trips,
        expenses: s.expenses,
        notifications: s.notifications,
      }),
    }
  )
);
