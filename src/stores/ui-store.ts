import { create } from "zustand";

interface UIState {
  showSplash: boolean;
  paymentFilter: "all" | "pending" | "paid" | "overdue";
  paymentSort: "date" | "amount" | "priority";
  setShowSplash: (v: boolean) => void;
  setPaymentFilter: (f: UIState["paymentFilter"]) => void;
  setPaymentSort: (s: UIState["paymentSort"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showSplash: true,
  paymentFilter: "all",
  paymentSort: "date",
  setShowSplash: (v) => set({ showSplash: v }),
  setPaymentFilter: (f) => set({ paymentFilter: f }),
  setPaymentSort: (s) => set({ paymentSort: s }),
}));
