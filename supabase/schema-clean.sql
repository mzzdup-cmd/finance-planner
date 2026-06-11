-- =============================================
-- ПОЛНАЯ ЧИСТАЯ УСТАНОВКА (запустить ОДИН раз)
-- SQL Editor → New query → вставить ВСЁ → Run
-- Удаляет старые таблицы и создаёт заново
-- =============================================

-- Удаляем старое (если было частично создано)
-- CASCADE на таблицах автоматически удаляет триггеры
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP TABLE IF EXISTS vacation_expenses CASCADE;
DROP TABLE IF EXISTS vacation_trips CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS savings_goals CASCADE;
DROP TABLE IF EXISTS payment_instances CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS monthly_incomes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS vacation_expense_type CASCADE;
DROP TYPE IF EXISTS payment_priority CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_category CASCADE;

-- Дальше — полная схема
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE payment_category AS ENUM (
  'housing', 'family', 'loans', 'taxes',
  'subscriptions', 'transport', 'leisure', 'other'
);

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'skipped');
CREATE TYPE payment_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE vacation_expense_type AS ENUM (
  'tickets', 'accommodation', 'food', 'transport', 'entertainment', 'shopping', 'other'
);

CREATE TYPE notification_type AS ENUM (
  'payment_reminder', 'payment_due', 'payment_overdue', 'savings_reminder', 'goal_deadline'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'RUB',
  default_salary NUMERIC(12,2) DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  push_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE monthly_incomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  extra_income NUMERIC(12,2) DEFAULT 0,
  extra_income_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category payment_category NOT NULL DEFAULT 'other',
  priority payment_priority DEFAULT 'medium',
  color TEXT DEFAULT '#4C6EF5',
  comment TEXT,
  is_recurring BOOLEAN DEFAULT TRUE,
  day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category payment_category NOT NULL DEFAULT 'other',
  priority payment_priority DEFAULT 'medium',
  color TEXT DEFAULT '#4C6EF5',
  comment TEXT,
  due_date DATE NOT NULL,
  status payment_status DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_instances_user_month ON payment_instances(user_id, year, month);
CREATE INDEX idx_payment_instances_due_date ON payment_instances(due_date);
CREATE INDEX idx_payment_instances_status ON payment_instances(status);

CREATE TABLE savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  current_amount NUMERIC(12,2) DEFAULT 0,
  monthly_contribution NUMERIC(12,2) DEFAULT 0,
  deadline DATE,
  color TEXT DEFAULT '#00D68F',
  icon TEXT DEFAULT 'target',
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vacation_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  saved_amount NUMERIC(12,2) DEFAULT 0,
  color TEXT DEFAULT '#4C6EF5',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vacation_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES vacation_trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  expense_type vacation_expense_type NOT NULL DEFAULT 'other',
  expense_date DATE,
  is_planned BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacation_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacation_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users manage own incomes" ON monthly_incomes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own payments" ON payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own instances" ON payment_instances FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own goals" ON savings_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own trips" ON vacation_trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own expenses" ON vacation_expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER monthly_incomes_updated_at BEFORE UPDATE ON monthly_incomes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payment_instances_updated_at BEFORE UPDATE ON payment_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER savings_goals_updated_at BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER vacation_trips_updated_at BEFORE UPDATE ON vacation_trips FOR EACH ROW EXECUTE FUNCTION update_updated_at();
