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

type ComparisonResult = {
  current: number;        // centavos
  previous: number;       // centavos
  deltaPercent: number;   // %, positivo = gastou MAIS este mês (ruim)
  hasPrevious: boolean;   // false quando não há dado do mês anterior pra comparar
  loading: boolean;
};

// Busca despesas do mês atual + mês anterior numa só query e agrega.
// Filtra por user_id via RLS (transparente).
export function useMonthlyComparison(refreshKey = 0): ComparisonResult {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(0);
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
        .select("amount, occurred_at")
        .gte("occurred_at", format(prevStart, "yyyy-MM-dd"))
        .lte("occurred_at", format(currEnd, "yyyy-MM-dd"));

      if (cancelled) return;

      if (!error && data) {
        let c = 0;
        let p = 0;
        for (const row of data as { amount: number; occurred_at: string }[]) {
          const d = parseISO(row.occurred_at);
          if (isWithinInterval(d, { start: currStart, end: currEnd })) c += row.amount;
          else if (isWithinInterval(d, { start: prevStart, end: prevEnd })) p += row.amount;
        }
        setCurrent(c);
        setPrevious(p);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const hasPrevious = previous > 0;
  const deltaPercent = hasPrevious ? ((current - previous) / previous) * 100 : 0;

  return { current, previous, deltaPercent, hasPrevious, loading };
}
