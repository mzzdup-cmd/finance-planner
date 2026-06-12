/**
 * Demo data for offline development and UI testing.
 * Enable with NEXT_PUBLIC_DEMO_MODE=true
 */
import type {
  MonthlyIncome,
  PaymentInstance,
  SavingsGoal,
  VacationTrip,
  VacationExpense,
  AppNotification,
  Profile,
} from "@/types";

export const DEMO_USER_ID = "demo-user-001";

export const demoProfile: Profile = {
  id: DEMO_USER_ID,
  email: "ekaterina@finance.app",
  full_name: "Екатерина",
  avatar_url: null,
  currency: "RUB",
  default_salary: 185000,
  onboarding_completed: true,
  theme: "system",
  push_enabled: true,
};

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

export const demoIncome: MonthlyIncome = {
  id: "income-001",
  user_id: DEMO_USER_ID,
  year,
  month,
  salary: 185000,
  extra_income: 15000,
  extra_income_note: "Фриланс",
};

export const demoPayments: PaymentInstance[] = [
  {
    id: "pi-001", user_id: DEMO_USER_ID, payment_id: "p-001",
    title: "Аренда квартиры", amount: 45000, category: "housing",
    priority: "critical", color: "#4C6EF5", comment: null,
    due_date: `${year}-${String(month).padStart(2, "0")}-05`,
    status: "paid", paid_at: new Date().toISOString(), year, month,
  },
  {
    id: "pi-002", user_id: DEMO_USER_ID, payment_id: "p-002",
    title: "Ипотека", amount: 32000, category: "loans",
    priority: "critical", color: "#FA5252", comment: "Сбербанк",
    due_date: `${year}-${String(month).padStart(2, "0")}-10`,
    status: "paid", paid_at: new Date().toISOString(), year, month,
  },
  {
    id: "pi-003", user_id: DEMO_USER_ID, payment_id: "p-003",
    title: "Детский сад", amount: 18000, category: "family",
    priority: "high", color: "#FF6B6B", comment: null,
    due_date: `${year}-${String(month).padStart(2, "0")}-15`,
    status: "pending", paid_at: null, year, month,
  },
  {
    id: "pi-004", user_id: DEMO_USER_ID, payment_id: "p-004",
    title: "Интернет + ТВ", amount: 1200, category: "subscriptions",
    priority: "medium", color: "#845EF7", comment: null,
    due_date: `${year}-${String(month).padStart(2, "0")}-20`,
    status: "pending", paid_at: null, year, month,
  },
  {
    id: "pi-005", user_id: DEMO_USER_ID, payment_id: "p-005",
    title: "Мобильная связь", amount: 800, category: "subscriptions",
    priority: "low", color: "#845EF7", comment: null,
    due_date: `${year}-${String(month).padStart(2, "0")}-22`,
    status: "pending", paid_at: null, year, month,
  },
  {
    id: "pi-006", user_id: DEMO_USER_ID, payment_id: "p-006",
    title: "Страховка ОСАГО", amount: 5500, category: "transport",
    priority: "medium", color: "#20C997", comment: "Ежемесячный взнос",
    due_date: `${year}-${String(month).padStart(2, "0")}-25`,
    status: "pending", paid_at: null, year, month,
  },
  {
    id: "pi-007", user_id: DEMO_USER_ID, payment_id: "p-007",
    title: "Налоги ИП", amount: 8500, category: "taxes",
    priority: "high", color: "#868E96", comment: null,
    due_date: `${year}-${String(month).padStart(2, "0")}-28`,
    status: "pending", paid_at: null, year, month,
  },
  {
    id: "pi-008", user_id: DEMO_USER_ID, payment_id: "p-008",
    title: "Netflix + Spotify", amount: 1490, category: "subscriptions",
    priority: "low", color: "#845EF7", comment: null,
    due_date: `${year}-${String(month).padStart(2, "0")}-01`,
    status: "overdue", paid_at: null, year, month,
  },
];

export const demoGoals: SavingsGoal[] = [
  {
    id: "goal-001", user_id: DEMO_USER_ID,
    title: "Отпуск в Турции", target_amount: 250000, current_amount: 145000,
    monthly_contribution: 25000, deadline: `${year + 1}-06-01`,
    color: "#4C6EF5", icon: "plane", is_completed: false,
  },
  {
    id: "goal-002", user_id: DEMO_USER_ID,
    title: "Подушка безопасности", target_amount: 500000, current_amount: 320000,
    monthly_contribution: 15000, deadline: null,
    color: "#00D68F", icon: "shield", is_completed: false,
  },
  {
    id: "goal-003", user_id: DEMO_USER_ID,
    title: "MacBook Pro", target_amount: 180000, current_amount: 95000,
    monthly_contribution: 20000, deadline: `${year}-12-01`,
    color: "#845EF7", icon: "laptop", is_completed: false,
  },
  {
    id: "goal-004", user_id: DEMO_USER_ID,
    title: "Ремонт балкона", target_amount: 120000, current_amount: 120000,
    monthly_contribution: 0, deadline: `${year}-03-01`,
    color: "#FFD43B", icon: "hammer", is_completed: true,
  },
];

export const demoTrips: VacationTrip[] = [
  {
    id: "trip-001", user_id: DEMO_USER_ID,
    title: "Турция, Анталья", destination: "Анталья, Турция",
    start_date: `${year + 1}-06-15`, end_date: `${year + 1}-06-28`,
    budget: 250000, saved_amount: 145000, color: "#4C6EF5",
    notes: "All inclusive, 2 взрослых + ребёнок",
  },
];

export const demoExpenses: VacationExpense[] = [
  { id: "exp-001", trip_id: "trip-001", user_id: DEMO_USER_ID, title: "Авиабилеты туда-обратно", amount: 85000, paid_amount: 85000, expense_type: "tickets", expense_date: null, duration: "11ч", comment: "Самолёт", is_planned: true },
  { id: "exp-002", trip_id: "trip-001", user_id: DEMO_USER_ID, title: "Отель Rixos 13 ночей", amount: 120000, paid_amount: 60000, expense_type: "accommodation", expense_date: null, duration: "13 дней", comment: "All inclusive", is_planned: true },
  { id: "exp-003", trip_id: "trip-001", user_id: DEMO_USER_ID, title: "Трансфер", amount: 8000, paid_amount: 0, expense_type: "transport", expense_date: null, duration: null, comment: null, is_planned: true },
  { id: "exp-004", trip_id: "trip-001", user_id: DEMO_USER_ID, title: "Экскурсии", amount: 25000, paid_amount: 0, expense_type: "entertainment", expense_date: null, duration: null, comment: null, is_planned: true },
  { id: "exp-005", trip_id: "trip-001", user_id: DEMO_USER_ID, title: "Сувениры и шопинг", amount: 12000, paid_amount: 0, expense_type: "shopping", expense_date: null, duration: null, comment: null, is_planned: true },
];

export const demoNotifications: AppNotification[] = [
  {
    id: "notif-001", user_id: DEMO_USER_ID, type: "payment_overdue",
    title: "Просрочен платёж", body: "Netflix + Spotify — 1 490 ₽",
    reference_id: "pi-008", is_read: false,
    scheduled_at: null, sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "notif-002", user_id: DEMO_USER_ID, type: "payment_reminder",
    title: "Платёж через 3 дня", body: "Детский сад — 18 000 ₽",
    reference_id: "pi-003", is_read: false,
    scheduled_at: null, sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "notif-003", user_id: DEMO_USER_ID, type: "savings_reminder",
    title: "Напоминание о накоплениях", body: "Отложите 25 000 ₽ на отпуск в Турции",
    reference_id: "goal-001", is_read: true,
    scheduled_at: null, sent_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const demoIncomeHistory: MonthlyIncome[] = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return {
    id: `income-hist-${i}`,
    user_id: DEMO_USER_ID,
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    salary: 180000 + i * 1000,
    extra_income: i === 0 ? 15000 : i % 2 === 0 ? 10000 : 0,
    extra_income_note: i === 0 ? "Фриланс" : null,
  };
});
