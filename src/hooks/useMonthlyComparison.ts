import { useEffect, useState } from "react";
import {
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { supabase } from "@/lib/supabase";
import type { TransactionType } from "@/types/transaction";

type ComparisonResult = {
  currentIncome: number; // centavos
  currentExpense: number; // centavos
  currentBalance: number; // centavos
  previousBalance: number; // centavos
  deltaPercent: number; // %, positivo = saldo maior este mês
  hasPrevious: boolean; // false quando não há dado do mês anterior pra comparar
  loading: boolean;
};

// Busca lançamentos do mês atual + mês anterior numa só query e agrega.
// Filtra por user_id via RLS (transparente).
export function useMonthlyComparison(refreshKey = 0): ComparisonResult {
  const [currentIncome, setCurrentIncome] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [previousIncome, setPreviousIncome] = useState(0);
  const [previousExpense, setPreviousExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const currStart = startOfMonth(now);
    const currEnd = endOfMonth(now);
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));

    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("amount, occurred_at, transaction_type")
        .gte("occurred_at", format(prevStart, "yyyy-MM-dd"))
        .lte("occurred_at", format(currEnd, "yyyy-MM-dd"));

      if (cancelled) return;

      if (!error && data) {
        let currIncome = 0;
        let currExpense = 0;
        let prevIncome = 0;
        let prevExpense = 0;
        for (const row of data as {
          amount: number;
          occurred_at: string;
          transaction_type: TransactionType;
        }[]) {
          const d = parseISO(row.occurred_at);
          if (isWithinInterval(d, { start: currStart, end: currEnd })) {
            if (row.transaction_type === "income") currIncome += row.amount;
            else currExpense += row.amount;
          } else if (isWithinInterval(d, { start: prevStart, end: prevEnd })) {
            if (row.transaction_type === "income") prevIncome += row.amount;
            else prevExpense += row.amount;
          }
        }
        setCurrentIncome(currIncome);
        setCurrentExpense(currExpense);
        setPreviousIncome(prevIncome);
        setPreviousExpense(prevExpense);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const currentBalance = currentIncome - currentExpense;
  const previousBalance = previousIncome - previousExpense;
  const hasPrevious = previousIncome > 0 || previousExpense > 0;
  const deltaPercent =
    hasPrevious && previousBalance !== 0
      ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100
      : 0;

  return {
    currentIncome,
    currentExpense,
    currentBalance,
    previousBalance,
    deltaPercent,
    hasPrevious,
    loading,
  };
}
