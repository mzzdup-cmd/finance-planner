export type PaymentCategory =
  | "housing"
  | "family"
  | "loans"
  | "taxes"
  | "subscriptions"
  | "transport"
  | "leisure"
  | "other";

export type PaymentStatus = "pending" | "paid" | "overdue" | "skipped";
export type PaymentPriority = "low" | "medium" | "high" | "critical";

export type VacationExpenseType =
  | "tickets"
  | "accommodation"
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "other";

export type NotificationType =
  | "payment_reminder"
  | "payment_due"
  | "payment_overdue"
  | "savings_reminder"
  | "goal_deadline";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  default_salary: number;
  onboarding_completed: boolean;
  theme: "light" | "dark" | "system";
  push_enabled: boolean;
}

export interface MonthlyIncome {
  id: string;
  user_id: string;
  year: number;
  month: number;
  salary: number;
  extra_income: number;
  extra_income_note: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: PaymentCategory;
  priority: PaymentPriority;
  color: string;
  comment: string | null;
  is_recurring: boolean;
  day_of_month: number | null;
  is_active: boolean;
}

export interface PaymentInstance {
  id: string;
  user_id: string;
  payment_id: string | null;
  title: string;
  amount: number;
  category: PaymentCategory;
  priority: PaymentPriority;
  color: string;
  comment: string | null;
  due_date: string;
  status: PaymentStatus;
  paid_at: string | null;
  year: number;
  month: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  deadline: string | null;
  color: string;
  icon: string;
  is_completed: boolean;
}

export interface VacationTrip {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  budget: number;
  saved_amount: number;
  color: string;
  notes: string | null;
}

export interface VacationExpense {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  amount: number;
  paid_amount: number;
  expense_type: VacationExpenseType;
  expense_date: string | null;
  duration: string | null;
  comment: string | null;
  is_planned: boolean;
}

/** Отложено за месяц + траты из этой суммы */
export interface TripMonthlySaving {
  id: string;
  trip_id: string;
  year: number;
  month: number;
  saved_amount: number;
  payments: { id: string; title: string; amount: number; note: string | null }[];
}

/** Счёт от зарплаты при планировании поездки */
export interface TripSalaryEntry {
  id: string;
  trip_id: string;
  label: string;
  salary: number;
  savings_set_aside: number;
  other_expenses: number;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  reference_id: string | null;
  is_read: boolean;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

/** Aggregated dashboard metrics for a given month */
export interface DashboardStats {
  totalIncome: number;
  totalPayments: number;
  paidPayments: number;
  remainingPayments: number;
  savingsPlanned: number;
  balanceAfterPayments: number;
  balanceAfterAll: number;
  paymentProgress: number;
  nextPayment: PaymentInstance | null;
  overdueCount: number;
}

export interface MonthlyForecast {
  monthKey: string;
  label: string;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: PaymentCategory;
  label: string;
  amount: number;
  color: string;
  percent: number;
}

/** Планируемая трата в планировщике месяца */
export interface PlannedExpense {
  id: string;
  title: string;
  amount: number;
}

/** План на конкретный месяц (будущие месяцы) */
export interface MonthPlan {
  id: string;
  year: number;
  month: number;
  salary: number;
  extra_income: number;
  expenses: PlannedExpense[];
  note: string | null;
}

/** Платёж по долгу (рассрочка, Долями и т.д.) */
export interface DebtInstallment {
  id: string;
  due_date: string;
  amount: number;
  is_paid: boolean;
}

/** Долг / рассрочка */
export interface Debt {
  id: string;
  title: string;
  total_amount: number;
  remaining_amount: number;
  color: string;
  installments: DebtInstallment[];
}
