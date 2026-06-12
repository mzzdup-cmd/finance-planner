import type { PaymentCategory, PaymentPriority } from "@/types";

export const PAYMENT_CATEGORIES: Record<
  PaymentCategory,
  { label: string; icon: string; color: string }
> = {
  housing: { label: "Жильё", icon: "Home", color: "#4C6EF5" },
  family: { label: "Семья", icon: "Users", color: "#FF6B6B" },
  loans: { label: "Кредиты", icon: "Landmark", color: "#FA5252" },
  taxes: { label: "Налоги", icon: "Receipt", color: "#868E96" },
  subscriptions: { label: "Подписки", icon: "Repeat", color: "#845EF7" },
  transport: { label: "Транспорт", icon: "Car", color: "#20C997" },
  leisure: { label: "Отдых", icon: "Palmtree", color: "#FFD43B" },
  other: { label: "Другое", icon: "MoreHorizontal", color: "#ADB5BD" },
};

export const PAYMENT_PRIORITIES: Record<
  PaymentPriority,
  { label: string; color: string }
> = {
  low: { label: "Низкий", color: "#ADB5BD" },
  medium: { label: "Средний", color: "#4C6EF5" },
  high: { label: "Высокий", color: "#FF922B" },
  critical: { label: "Критичный", color: "#FF6B6B" },
};

export const VACATION_EXPENSE_TYPES = {
  tickets: { label: "Билеты", color: "#4C6EF5" },
  accommodation: { label: "Жильё", color: "#845EF7" },
  food: { label: "Еда", color: "#20C997" },
  transport: { label: "Транспорт", color: "#FFD43B" },
  entertainment: { label: "Развлечения", color: "#FF6B6B" },
  shopping: { label: "Покупки", color: "#FA5252" },
  other: { label: "Другое", color: "#ADB5BD" },
} as const;

export const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTH_NAMES_SHORT = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

export const BOTTOM_NAV_ITEMS = [
  { href: "/", label: "Главная", icon: "Home" },
  { href: "/payments", label: "Платежи", icon: "CreditCard" },
  { href: "/goals", label: "Цели", icon: "Target" },
  { href: "/calendar", label: "Календарь", icon: "Calendar" },
  { href: "/more", label: "Ещё", icon: "Menu" },
] as const;

export const MORE_MENU_ITEMS = [
  { href: "/salary", label: "Зарплата", icon: "Wallet", description: "Доходы и история" },
  { href: "/planner", label: "Планировщик", icon: "CalendarRange", description: "Прогноз на будущие месяцы" },
  { href: "/debts", label: "Долги", icon: "Landmark", description: "Долями, рассрочки, кредиты" },
  { href: "/vacation", label: "Отпуск", icon: "Plane", description: "Планировщик поездок" },
  { href: "/analytics", label: "Аналитика", icon: "BarChart3", description: "Графики и прогноз" },
  { href: "/notifications", label: "Уведомления", icon: "Bell", description: "Напоминания" },
  { href: "/settings", label: "Настройки", icon: "Settings", description: "Тема и профиль" },
] as const;
