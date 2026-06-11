# Как поставить Finance на телефон (без ПК)

Чтобы приложение работало **без запуска кода на компьютере**, его нужно один раз выложить в интернет. Дальше вы открываете ссылку с телефона и добавляете на главный экран — как обычное приложение.

## Схема

```
Ваш код  →  GitHub  →  Vercel (бесплатный хостинг)  →  ссылка https://...
                                                          ↓
                                              Телефон: «На экран Домой»
```

Данные хранятся в **Supabase** (облачная БД) — не на ПК.

---

## Шаг 1. Supabase (база данных, 5 мин)

1. Зайдите на [supabase.com](https://supabase.com) → **Start your project** (бесплатно).
2. Создайте проект, запомните пароль к БД.
3. **SQL Editor** → New query → вставьте весь файл `supabase/schema.sql` → **Run**.
4. **Project Settings → API** — скопируйте:
   - `Project URL`
   - `anon public` key

---

## Шаг 2. GitHub (репозиторий, 5 мин)

1. Зайдите на [github.com](https://github.com) → **New repository**.
2. Название: `finance-planner`, Private или Public.
3. На ПК в папке проекта (один раз):

```powershell
cd C:\Users\Екатерина\Desktop\finance-planner
git init
git add .
git commit -m "Finance planner — initial deploy"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/finance-planner.git
git push -u origin main
```

---

## Шаг 3. Vercel (публикация в интернет, 5 мин)

1. [vercel.com](https://vercel.com) → войти через **GitHub**.
2. **Add New → Project** → выберите `finance-planner`.
3. **Environment Variables** — добавьте:

| Имя | Значение |
|-----|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL из Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key из Supabase |
| `NEXT_PUBLIC_DEMO_MODE` | `false` |

4. **Deploy** — через 2–3 минуты появится ссылка вида:
   `https://finance-planner-xxxx.vercel.app`

Эту ссылку можно открывать с любого телефона **без ПК**.

---

## Шаг 4. Установка на телефон

### iPhone (Safari)

1. Откройте ссылку Vercel в **Safari** (не в Chrome).
2. Кнопка **Поделиться** (квадрат со стрелкой вверх).
3. **«На экран Домой»** → **Добавить**.
4. На главном экране появится иконка **Finance** — открывается как отдельное приложение.

### Android (Chrome)

1. Откройте ссылку в Chrome.
2. Меню (три точки) → **«Установить приложение»** или **«Добавить на главный экран»**.
3. Подтвердите установку.

---

## Обновления

После изменений в коде:

```powershell
git add .
git commit -m "описание изменений"
git push
```

Vercel **сам пересоберёт** сайт — на телефоне достаточно обновить страницу.

---

## Демо без Supabase (временно)

Если Supabase пока не настроен, на Vercel можно оставить:

```
NEXT_PUBLIC_DEMO_MODE=true
```

Данные будут храниться в браузере телефона (localStorage), без синхронизации между устройствами.

---

## Частые вопросы

**Нужен ли включённый ПК?**  
Нет. После деплоя всё работает на серверах Vercel + Supabase.

**Это бесплатно?**  
Да, для личного использования хватает бесплатных тарифов Vercel и Supabase.

**Работает без интернета?**  
Частично: PWA кэширует интерфейс, но для синхронизации данных нужен интернет.

**Как сменить ссылку на свою?**  
Vercel → Project → Settings → Domains → можно подключить свой домен.
