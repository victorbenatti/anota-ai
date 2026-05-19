import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Expense } from "@/types/expense";

type UsePersonalDataResult = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Busca todas as despesas do usuario autenticado para visualizacao/exportacao.
// A RLS mantem o escopo limitado ao proprio usuario.
export function usePersonalData(): UsePersonalDataResult {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalData = useCallback(async () => {
    if (!user) {
      setExpenses([]);
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
      setExpenses([]);
    } else {
      setExpenses((data ?? []) as Expense[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchPersonalData();
  }, [fetchPersonalData]);

  return { expenses, loading, error, refetch: fetchPersonalData };
}
