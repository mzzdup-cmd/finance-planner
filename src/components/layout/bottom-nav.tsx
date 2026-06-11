"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home, CreditCard, Target, Calendar, Menu,
} from "lucide-react";
import { cn, hapticTap } from "@/lib/utils";
import { BOTTOM_NAV_ITEMS } from "@/lib/constants";

const ICONS = { Home, CreditCard, Target, Calendar, Menu };

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
      <div className="glass mx-auto flex max-w-lg items-center justify-around rounded-3xl px-2 py-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => hapticTap()}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-1 rounded-2xl bg-accent/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-5 w-5 transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "relative z-10 text-[10px] font-medium transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
