"use client";

import { useEffect } from "react";
import { useFinanceStore } from "@/stores/finance-store";
import { useUIStore } from "@/stores/ui-store";

export function useHydrate() {
  const hydrate = useFinanceStore((s) => s.hydrate);
  const isHydrated = useFinanceStore((s) => s.isHydrated);
  const setShowSplash = useUIStore((s) => s.setShowSplash);

  useEffect(() => {
    // Сначала ждём localStorage, потом hydrate — иначе демо затирает удаления
    const runHydrate = () => hydrate();

    if (useFinanceStore.persist.hasHydrated()) {
      runHydrate();
      return;
    }

    const unsub = useFinanceStore.persist.onFinishHydration(runHydrate);
    return unsub;
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated) {
      const timer = setTimeout(() => setShowSplash(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, setShowSplash]);

  return { isHydrated };
}
