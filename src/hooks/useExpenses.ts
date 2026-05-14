import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Expense, PeriodRange } from "@/types/expense";

type UseExpensesResult = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Busca despesas dentro de um período. occurred_at é tratado como ISO/UTC
// no banco; o filtro usa o range exato fornecido (já em UTC pelos toISOString).
export function useExpenses(range: PeriodRange): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("expenses")
      .select("*")
      .gte("occurred_at", range.from.toISOString())
      .lte("occurred_at", range.to.toISOString())
      .order("occurred_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setExpenses([]);
    } else {
      setExpenses((data ?? []) as Expense[]);
    }
    setLoading(false);
  }, [range.from, range.to]);

  useEffect(() => {
    void fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, error, refetch: fetchExpenses };
}
