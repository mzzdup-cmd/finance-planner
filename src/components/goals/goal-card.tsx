"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, AlertCircle } from "lucide-react";
import { formatMoney, formatDate } from "@/lib/utils";
import { goalProgress } from "@/lib/calculations";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SavingsGoal } from "@/types";

interface GoalCardProps {
  goal: SavingsGoal;
  index?: number;
  onClick?: () => void;
}

export function GoalCard({ goal, index = 0, onClick }: GoalCardProps) {
  const { percent, remaining, onTrack, monthsLeft } = goalProgress(goal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer rounded-3xl border border-border/50 bg-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
          >
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{goal.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatMoney(goal.current_amount)} из {formatMoney(goal.target_amount)}
            </p>
          </div>
        </div>
        {goal.is_completed ? (
          <Badge variant="success">Готово</Badge>
        ) : onTrack ? (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> В плане
          </Badge>
        ) : (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" /> Отстаём
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-muted-foreground">{percent}%</span>
          <span className="font-medium">Осталось {formatMoney(remaining)}</span>
        </div>
        <Progress
          value={percent}
          className="h-2.5"
          indicatorClassName="transition-all"
          style={{ ["--progress-color" as string]: goal.color }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatMoney(goal.monthly_contribution)}/мес</span>
        {goal.deadline && (
          <span>
            до {formatDate(goal.deadline, "long")}
            {monthsLeft !== null && ` · ${monthsLeft} мес.`}
          </span>
        )}
      </div>
    </motion.div>
  );
}
