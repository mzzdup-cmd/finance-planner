"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-accent shadow-2xl shadow-accent/30"
      >
        <Wallet className="h-12 w-12 text-white" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-bold tracking-tight"
      >
        Finance
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-2 text-muted-foreground"
      >
        Ваш личный финансовый планировщик
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 h-1 w-16 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
