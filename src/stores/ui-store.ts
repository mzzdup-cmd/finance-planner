import { create } from "zustand";

interface UIState {
  showSplash: boolean;
  hideBottomNav: boolean;
  paymentFilter: "all" | "pending" | "paid" | "overdue";
  paymentSort: "date" | "amount" | "priority";
  setShowSplash: (v: boolean) => void;
  setHideBottomNav: (v: boolean) => void;
  setPaymentFilter: (f: UIState["paymentFilter"]) => void;
  setPaymentSort: (s: UIState["paymentSort"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showSplash: true,
  hideBottomNav: false,
  paymentFilter: "all",
  paymentSort: "date",
  setShowSplash: (v) => set({ showSplash: v }),
  setHideBottomNav: (v) => set({ hideBottomNav: v }),
  setPaymentFilter: (f) => set({ paymentFilter: f }),
  setPaymentSort: (s) => set({ paymentSort: s }),
}));
