import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import type { PeriodRange, Transaction } from "@/types/transaction";

export type UseTransactionsResult = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Busca lançamentos dentro de um período. `occurred_at` no banco é DATE
// (sem hora), então mandamos YYYY-MM-DD direto para evitar bordas de fuso.
export function useTransactions(range: PeriodRange): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const from = format(range.from, "yyyy-MM-dd");
    const to = format(range.to, "yyyy-MM-dd");

    const { data, error: queryError } = await supabase
      .from("expenses")
      .select("*")
      .gte("occurred_at", from)
      .lte("occurred_at", to)
      .order("occurred_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setTransactions([]);
    } else {
      setTransactions((data ?? []) as Transaction[]);
    }
    setLoading(false);
  }, [range.from, range.to]);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
}
