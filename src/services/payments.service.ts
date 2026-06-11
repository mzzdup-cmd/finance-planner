import { createClient, isDemoMode } from "@/lib/supabase/client";
import type { PaymentInstance } from "@/types";

/** Payments API — Supabase CRUD with demo fallback */
export const paymentsService = {
  async getByMonth(userId: string, year: number, month: number): Promise<PaymentInstance[]> {
    if (isDemoMode()) return [];

    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("payment_instances")
      .select("*")
      .eq("user_id", userId)
      .eq("year", year)
      .eq("month", month)
      .order("due_date");

    if (error) throw error;
    return data as PaymentInstance[];
  },

  async create(instance: Omit<PaymentInstance, "id">): Promise<PaymentInstance> {
    if (isDemoMode()) throw new Error("Use store in demo mode");

    const supabase = createClient();
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("payment_instances")
      .insert(instance)
      .select()
      .single();

    if (error) throw error;
    return data as PaymentInstance;
  },

  async updateStatus(id: string, status: PaymentInstance["status"]): Promise<void> {
    if (isDemoMode()) return;

    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("payment_instances")
      .update({
        status,
        paid_at: status === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (isDemoMode()) return;

    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.from("payment_instances").delete().eq("id", id);
    if (error) throw error;
  },
};
