-- Запустите этот файл, если schema.sql упал с ошибкой enum "other"
-- SQL Editor → New query → вставьте → Run

ALTER TYPE vacation_expense_type ADD VALUE IF NOT EXISTS 'other';
