import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Transaction } from "@/types/transaction";

type UsePersonalDataResult = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Busca todos os lancamentos do usuario autenticado para visualizacao/exportacao.
// A RLS mantem o escopo limitado ao proprio usuario.
export function usePersonalData(): UsePersonalDataResult {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalData = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("expenses")
      .select("*")
      .order("occurred_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setTransactions([]);
    } else {
      setTransactions((data ?? []) as Transaction[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchPersonalData();
  }, [fetchPersonalData]);

  return { transactions, loading, error, refetch: fetchPersonalData };
}
