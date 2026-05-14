import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Expense } from "@/types/expense";

// Escuta INSERTs na tabela expenses e dispara o callback recebido.
// O componente consumidor decide o que fazer (refetch, toast, etc).
export function useSupabaseRealtime(onInsert: (expense: Expense) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("expenses-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "expenses" },
        (payload) => {
          onInsert(payload.new as Expense);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onInsert]);
}
