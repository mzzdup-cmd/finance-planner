"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  onClick?: () => void;
  delay?: number;
}

export function GlassCard({ children, className, gradient, onClick, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "glass relative overflow-hidden rounded-3xl p-5",
        onClick && "cursor-pointer",
        className
      )}
    >
      {gradient && (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
          style={{ background: gradient }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
