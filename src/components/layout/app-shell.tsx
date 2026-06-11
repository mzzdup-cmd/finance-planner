"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";
import { SplashScreen } from "@/components/onboarding/splash-screen";
import { useHydrate } from "@/hooks/use-hydrate";
import { useUIStore } from "@/stores/ui-store";

/** Sub-pages hide bottom navigation for cleaner back-navigation UX */
const HIDE_NAV_PATHS = ["/salary", "/vacation", "/analytics", "/notifications", "/settings"];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isHydrated } = useHydrate();
  const showSplash = useUIStore((s) => s.showSplash);
  const hideBottomNav = useUIStore((s) => s.hideBottomNav);
  const hideNav = HIDE_NAV_PATHS.some((p) => pathname.startsWith(p)) || hideBottomNav;

  if (!isHydrated || showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className={hideNav ? "pb-8" : "pb-28"}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
