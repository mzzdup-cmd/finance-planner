# Finance Planner

Премиальное мобильное PWA для личного финансового планирования в стиле Tinkoff / Revolut.

## Стек

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS** + shadcn/ui компоненты
- **Zustand** — глобальное состояние
- **Recharts** — графики и аналитика
- **Framer Motion** — анимации
- **Supabase** — БД, Auth, RLS
- **next-pwa** — установка на телефон
- **next-themes** — тёмная / светлая тема

## Быстрый старт

```bash
cd finance-planner
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). По умолчанию работает **демо-режим** с тестовыми данными.

## Разделы

| Раздел | Путь | Описание |
|--------|------|----------|
| Dashboard | `/` | Остаток, прогресс, графики |
| Платежи | `/payments` | Обязательные ежемесячные платежи |
| Цели | `/goals` | Накопления и цели |
| Календарь | `/calendar` | Платежи по датам |
| Зарплата | `/salary` | Доходы и история |
| Отпуск | `/vacation` | Планировщик поездок |
| Аналитика | `/analytics` | Графики и прогноз |
| Уведомления | `/notifications` | Напоминания |
| Настройки | `/settings` | Тема, профиль |

## Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Выполните `supabase/schema.sql` в SQL Editor
3. Скопируйте `.env.example` → `.env.local` и укажите ключи
4. Установите `NEXT_PUBLIC_DEMO_MODE=false`

## Установка на телефон (без ПК)

`npm run dev` на компьютере — только для разработки. Чтобы пользоваться с телефона **без запущенного ПК**, один раз выложите приложение в интернет:

1. **Supabase** — облачная база данных (бесплатно)
2. **GitHub** — хранение кода
3. **Vercel** — хостинг, даёт ссылку `https://ваш-проект.vercel.app`

Подробная инструкция: **[docs/DEPLOY-PHONE.md](docs/DEPLOY-PHONE.md)**

После деплоя на телефоне:
- **iPhone:** Safari → Поделиться → «На экран Домой»
- **Android:** Chrome → «Установить приложение»

Перед первым деплоем (один раз на ПК): `npm install` → `npm run icons` → закоммитить PNG-иконки.

## Архитектура

Подробнее: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
