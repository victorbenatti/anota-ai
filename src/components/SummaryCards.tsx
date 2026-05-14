import { useMemo } from "react";
import { Wallet, Gauge, ReceiptText, PieChart, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_META } from "@/types/expense";
import type { Expense, ExpenseCategory, PeriodRange } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";

type SummaryCardsProps = {
  expenses: Expense[];
  range: PeriodRange;
  loading: boolean;
};

function useSummary(expenses: Expense[], range: PeriodRange) {
  return useMemo(() => {
    const total = expenses.reduce((acc, e) => acc + e.amount, 0);
    const count = expenses.length;
    const days = Math.max(1, differenceInCalendarDays(range.to, range.from) + 1);
    const dailyAvg = total / days;
    const ticketAvg = count > 0 ? total / count : 0;

    const byCategory = new Map<ExpenseCategory, number>();
    for (const e of expenses) {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
    }

    let topCategory: ExpenseCategory | null = null;
    let topAmount = 0;
    for (const [cat, amount] of byCategory) {
      if (amount > topAmount) {
        topCategory = cat;
        topAmount = amount;
      }
    }

    const topShare = total > 0 ? (topAmount / total) * 100 : 0;
    return { total, count, dailyAvg, ticketAvg, topCategory, topAmount, topShare };
  }, [expenses, range.from, range.to]);
}

export function SummaryCards({ expenses, range, loading }: SummaryCardsProps) {
  const { total, count, dailyAvg, ticketAvg, topCategory, topAmount, topShare } =
    useSummary(expenses, range);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const topLabel = topCategory ? CATEGORY_META[topCategory].label : "Sem dados";
  const topColor = topCategory ? CATEGORY_META[topCategory].color : undefined;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Wallet}
        label="Total da semana"
        value={formatCurrency(total)}
        hint={`${count} ${count === 1 ? "lançamento" : "lançamentos"}`}
        emphasis
      />
      <StatCard
        icon={Gauge}
        label="Média diária"
        value={formatCurrency(dailyAvg)}
        hint="ritmo de consumo"
      />
      <StatCard
        icon={PieChart}
        label="Categoria líder"
        value={topLabel}
        hint={
          topCategory
            ? `${formatCurrency(topAmount)} · ${topShare.toFixed(0)}%`
            : "sem concentração"
        }
        marker={topColor}
        textValue
      />
      <StatCard
        icon={ReceiptText}
        label="Ticket médio"
        value={formatCurrency(ticketAvg)}
        hint={`${count} ${count === 1 ? "compra" : "compras"}`}
      />
    </div>
  );
}

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  emphasis?: boolean;
  textValue?: boolean;
  marker?: string;
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  emphasis,
  textValue,
  marker,
}: StatCardProps) {
  return (
    <div className="card-soft flex flex-col gap-4 p-5 transition-shadow hover:shadow-soft-md">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-brand">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      <div className="flex items-center gap-2">
        {marker && (
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: marker }}
            aria-hidden
          />
        )}
        <span
          className={[
            "leading-none",
            textValue
              ? "truncate text-xl font-bold text-ink"
              : "num text-2xl font-semibold",
            emphasis && !textValue ? "text-stamp" : "",
            !emphasis && !textValue ? "text-ink" : "",
          ].join(" ")}
        >
          {value}
        </span>
      </div>

      <span className="num text-xs text-ink-muted">{hint}</span>
    </div>
  );
}
