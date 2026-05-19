import { useMemo } from "react";
import { parseISO, format, differenceInCalendarDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  Crown,
  Flame,
  Sparkles,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_META } from "@/types/transaction";
import type {
  PeriodRange,
  Transaction,
  TransactionCategory,
} from "@/types/transaction";
import { formatCurrency } from "@/lib/utils";

export type InsightTone = "positive" | "alert" | "neutral";

export type Insight = {
  id: string;
  icon: LucideIcon;
  tone: InsightTone;
  title: string;
  description: string;
};

type UseInsightsArgs = {
  transactions: Transaction[];
  range: PeriodRange;
};

/**
 * Deriva insights "interpretativos" a partir das transações do período.
 * Cada função abaixo retorna null se não houver dado suficiente — assim o
 * componente pode esconder graciosamente em vez de mostrar texto vazio.
 */
export function useInsights({ transactions, range }: UseInsightsArgs): Insight[] {
  return useMemo(() => {
    const expenses = transactions.filter((t) => t.transaction_type === "expense");
    const incomes = transactions.filter((t) => t.transaction_type === "income");

    const insights: (Insight | null)[] = [
      topExpenseCategory(expenses),
      biggestExpense(expenses),
      busiestDay(expenses),
      savingsAlert(incomes, expenses),
      densityHint(transactions, range),
    ];

    return insights.filter((i): i is Insight => i !== null);
  }, [transactions, range.from, range.to]);
}

// ---------- Geradores de insight ----------

function topExpenseCategory(expenses: Transaction[]): Insight | null {
  if (expenses.length === 0) return null;

  const totals = new Map<TransactionCategory, number>();
  let grandTotal = 0;
  for (const t of expenses) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    grandTotal += t.amount;
  }

  let topCategory: TransactionCategory | null = null;
  let topAmount = 0;
  for (const [cat, amt] of totals) {
    if (amt > topAmount) {
      topCategory = cat;
      topAmount = amt;
    }
  }

  if (!topCategory || grandTotal === 0) return null;
  const pct = (topAmount / grandTotal) * 100;
  const meta = CATEGORY_META[topCategory];

  return {
    id: "top-category",
    icon: Crown,
    tone: pct > 50 ? "alert" : "neutral",
    title: `${meta.label} domina`,
    description: `${pct.toFixed(0)}% das despesas (${formatCurrency(topAmount)})`,
  };
}

function biggestExpense(expenses: Transaction[]): Insight | null {
  if (expenses.length === 0) return null;
  let biggest = expenses[0];
  for (const t of expenses) {
    if (t.amount > biggest.amount) biggest = t;
  }
  if (biggest.amount < 5000) return null; // ignora gastos triviais < R$50

  const date = format(parseISO(biggest.occurred_at), "dd/MM", { locale: ptBR });
  return {
    id: "biggest-expense",
    icon: Flame,
    tone: "alert",
    title: "Maior despesa",
    description: `${biggest.description} — ${formatCurrency(biggest.amount)} em ${date}`,
  };
}

function busiestDay(expenses: Transaction[]): Insight | null {
  if (expenses.length < 3) return null;

  const byDay = new Map<string, number>();
  for (const t of expenses) {
    const key = t.occurred_at;
    byDay.set(key, (byDay.get(key) ?? 0) + t.amount);
  }

  let peakDay: string | null = null;
  let peakAmount = 0;
  for (const [day, amt] of byDay) {
    if (amt > peakAmount) {
      peakDay = day;
      peakAmount = amt;
    }
  }

  if (!peakDay || peakAmount < 5000) return null;
  const formatted = format(parseISO(peakDay), "EEEE (dd/MM)", { locale: ptBR });

  return {
    id: "busiest-day",
    icon: Calendar,
    tone: "neutral",
    title: "Dia mais caro",
    description: `${capitalize(formatted)} — ${formatCurrency(peakAmount)}`,
  };
}

function savingsAlert(
  incomes: Transaction[],
  expenses: Transaction[]
): Insight | null {
  const incomeTotal = incomes.reduce((acc, t) => acc + t.amount, 0);
  const expenseTotal = expenses.reduce((acc, t) => acc + t.amount, 0);

  if (incomeTotal === 0) return null;

  const balance = incomeTotal - expenseTotal;
  const ratio = balance / incomeTotal;

  if (ratio >= 0.2) {
    return {
      id: "savings-good",
      icon: TrendingUp,
      tone: "positive",
      title: `Boa folga: ${(ratio * 100).toFixed(0)}% sobrando`,
      description: `Você guardou ${formatCurrency(balance)} no período.`,
    };
  }

  if (ratio < 0) {
    return {
      id: "savings-bad",
      icon: TrendingDown,
      tone: "alert",
      title: "Saldo negativo no período",
      description: `Você gastou ${formatCurrency(Math.abs(balance))} a mais que recebeu.`,
    };
  }

  if (ratio < 0.1) {
    return {
      id: "savings-tight",
      icon: AlertCircle,
      tone: "alert",
      title: "Saldo apertado",
      description: `Só ${(ratio * 100).toFixed(0)}% das receitas sobraram.`,
    };
  }

  return null;
}

function densityHint(
  transactions: Transaction[],
  range: PeriodRange
): Insight | null {
  if (transactions.length < 3) return null;
  const days = Math.max(1, differenceInCalendarDays(range.to, range.from) + 1);
  const perDay = transactions.length / days;
  if (perDay < 0.5) return null;

  return {
    id: "density",
    icon: Sparkles,
    tone: "neutral",
    title: "Você está consistente",
    description: `Em média ${perDay.toFixed(1)} lançamento${perDay > 1.5 ? "s" : ""} por dia no período.`,
  };
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
