-- Demo seed data (run after schema.sql with a test user UUID)
-- Replace USER_ID with actual auth.users id

-- Example for local testing:
-- INSERT INTO profiles (id, email, full_name, default_salary, onboarding_completed)
-- VALUES ('USER_ID', 'demo@finance.app', 'Александр', 185000, true);

-- INSERT INTO monthly_incomes (user_id, year, month, salary, extra_income, extra_income_note)
-- VALUES ('USER_ID', 2026, 6, 185000, 15000, 'Фриланс');
