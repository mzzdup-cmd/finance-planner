"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/stores/finance-store";

const STEPS = [
  {
    icon: Wallet,
    title: "Добро пожаловать",
    description: "Контролируйте обязательные платежи и планируйте бюджет как в банковском приложении",
    color: "#00D68F",
  },
  {
    icon: CreditCard,
    title: "Платежи под контролем",
    description: "Отмечайте оплаченные, следите за просрочками и знайте сколько останется с зарплаты",
    color: "#4C6EF5",
  },
  {
    icon: Target,
    title: "Цели и накопления",
    description: "Планируйте отпуск, крупные покупки и подушку безопасности",
    color: "#845EF7",
  },
  {
    icon: TrendingUp,
    title: "Ваша зарплата",
    description: "Укажите месячный доход — мы рассчитаем остаток автоматически",
    color: "#FFD43B",
    isForm: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useFinanceStore((s) => s.completeOnboarding);
  const setIncome = useFinanceStore((s) => s.setIncome);
  const [step, setStep] = useState(0);
  const [salary, setSalary] = useState("185000");

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setIncome({ salary: Number(salary) });
      completeOnboarding();
      router.push("/");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))]">
      <div className="mb-8 flex justify-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === step ? 32 : 8,
              backgroundColor: i <= step ? "#00D68F" : "hsl(var(--muted))",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1 flex-col items-center text-center"
        >
          <div
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl"
            style={{ backgroundColor: `${current.color}20` }}
          >
            <Icon className="h-12 w-12" style={{ color: current.color }} strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-bold">{current.title}</h1>
          <p className="mt-3 max-w-xs text-muted-foreground">{current.description}</p>

          {current.isForm && (
            <div className="mt-8 w-full max-w-xs">
              <Input
                type="number"
                placeholder="Зарплата в месяц"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="text-center text-lg font-bold"
              />
              <p className="mt-2 text-xs text-muted-foreground">Можно изменить позже</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Button size="lg" className="w-full" onClick={handleNext}>
        {isLast ? "Начать" : "Далее"}
      </Button>

      {!isLast && (
        <button
          onClick={() => { completeOnboarding(); router.push("/"); }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Пропустить
        </button>
      )}
    </div>
  );
}
