import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types/transaction";

// Escuta INSERTs na tabela expenses e dispara o callback recebido.
// O componente consumidor decide o que fazer (refetch, toast, etc).
export function useSupabaseRealtime(onInsert: (transaction: Transaction) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "expenses" },
        (payload) => {
          onInsert(payload.new as Transaction);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onInsert]);
}
