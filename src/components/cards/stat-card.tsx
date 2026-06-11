"use client";

import { motion } from "framer-motion";
import { cn, formatMoney } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "accent" | "success" | "warning" | "destructive";
  delay?: number;
  large?: boolean;
}

const variants = {
  default: "from-card to-card",
  accent: "from-accent/20 to-premium/10 border-accent/20",
  success: "from-success/20 to-success/5 border-success/20",
  warning: "from-warning/20 to-warning/5 border-warning/20",
  destructive: "from-destructive/20 to-destructive/5 border-destructive/20",
};

const iconColors = {
  default: "bg-muted text-foreground",
  accent: "bg-accent/20 text-accent",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
};

export function StatCard({
  title,
  amount,
  subtitle,
  icon: Icon,
  variant = "default",
  delay = 0,
  large = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              "mt-1 font-bold tabular-nums tracking-tight",
              large ? "text-3xl" : "text-2xl"
            )}
          >
            {formatMoney(amount)}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", iconColors[variant])}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
}
