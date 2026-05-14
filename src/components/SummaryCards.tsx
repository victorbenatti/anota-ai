import { useMemo, type ComponentType } from "react";
import { Banknote, Gauge, Receipt, Tags } from "lucide-react";
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
    return { total, count, days, dailyAvg, ticketAvg, topCategory, topAmount, topShare };
  }, [expenses, range.from, range.to]);
}

export function SummaryCards({ expenses, range, loading }: SummaryCardsProps) {
  const { total, count, days, dailyAvg, ticketAvg, topCategory, topAmount, topShare } =
    useSummary(expenses, range);

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Skeleton className="h-[240px] w-full" />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[116px] w-full" />
          ))}
        </div>
      </section>
    );
  }

  const topLabel = topCategory ? CATEGORY_META[topCategory].label : "Sem dados";
  const topColor = topCategory ? CATEGORY_META[topCategory].color : undefined;

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
      <div className="relative overflow-hidden border border-ink bg-paper p-6 shadow-[4px_4px_0_hsl(var(--ink))]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-ledger" />
              <span className="eyebrow">Total semanal</span>
            </div>
            <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-ink-soft">
              Principal indicador da semana atual. Use como ponto de partida
              para entender o ritmo dos seus gastos.
            </p>
          </div>
          <span className="num border border-rule bg-ledger-soft px-2 py-1 text-[10px] text-ledger">
            {days} dias
          </span>
        </div>

        <div className="mt-10 text-right">
          <div className="num text-5xl leading-none text-stamp md:text-6xl">
            {formatCurrency(total)}
          </div>
          <p className="mt-4 border-t border-dashed border-rule pt-3 font-sans text-sm text-ink-soft">
            {count === 0
              ? "Nenhum lançamento registrado nesta semana."
              : `${count} lançamentos registrados nesta semana.`}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <StatBlock
          icon={Gauge}
          eyebrow="Média diária"
          value={formatCurrency(dailyAvg)}
          meta="ritmo de consumo"
          monetary
        />
        <StatBlock
          icon={Tags}
          eyebrow="Categoria líder"
          value={topLabel}
          meta={
            topCategory
              ? `${formatCurrency(topAmount)} / ${topShare.toFixed(1)}%`
              : "sem concentração"
          }
          marker={topColor}
        />
        <StatBlock
          icon={Receipt}
          eyebrow="Ticket médio"
          value={formatCurrency(ticketAvg)}
          meta={`${String(count).padStart(2, "0")} lançamentos`}
          monetary
        />
      </div>
    </section>
  );
}

type StatBlockProps = {
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  value: string;
  meta: string;
  monetary?: boolean;
  marker?: string;
};

function StatBlock({
  icon: Icon,
  eyebrow,
  value,
  meta,
  monetary,
  marker,
}: StatBlockProps) {
  return (
    <div className="min-h-[116px] border border-rule bg-paper/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">{eyebrow}</span>
        <Icon className="h-4 w-4 text-ledger" />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        {marker && (
          <span
            className="mb-1 inline-block h-3 w-3 shrink-0 border border-ink/15"
            style={{ backgroundColor: marker }}
            aria-hidden
          />
        )}
        <span
          className={[
            "num ml-auto max-w-full break-words text-right text-2xl leading-none md:text-3xl",
            monetary ? "text-stamp" : "text-ink",
          ].join(" ")}
        >
          {value}
        </span>
      </div>

      <p className="mt-3 border-t border-dashed border-rule pt-2 text-right font-sans text-xs text-ink-soft">
        {meta}
      </p>
    </div>
  );
}
