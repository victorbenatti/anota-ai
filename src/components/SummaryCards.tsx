import { useMemo } from "react";
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
    return { total, count, dailyAvg, topCategory, topAmount };
  }, [expenses, range.from, range.to]);
}

export function SummaryCards({ expenses, range, loading }: SummaryCardsProps) {
  const { total, count, dailyAvg, topCategory, topAmount } = useSummary(
    expenses,
    range
  );

  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-t border-ink/80 px-5 py-6 sm:border-l-0 sm:[&:nth-child(odd)]:border-l sm:[&:nth-child(odd)]:border-rule lg:border-l lg:first:border-l-0 lg:border-rule"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-6 h-10 w-32" />
          </div>
        ))}
      </section>
    );
  }

  const topLabel = topCategory ? CATEGORY_META[topCategory].label : "—";
  const topColor = topCategory ? CATEGORY_META[topCategory].color : undefined;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatBlock
        eyebrow="Total gasto"
        value={formatCurrency(total)}
        accent
        index={0}
      />
      <StatBlock
        eyebrow="Média diária"
        value={formatCurrency(dailyAvg)}
        index={1}
      />
      <StatBlock
        eyebrow="Categoria líder"
        value={topLabel}
        meta={topCategory ? formatCurrency(topAmount) : undefined}
        valueClass="font-display italic font-normal"
        marker={topColor}
        index={2}
      />
      <StatBlock
        eyebrow="Lançamentos"
        value={String(count).padStart(2, "0")}
        meta="no período"
        index={3}
      />
    </section>
  );
}

type StatBlockProps = {
  eyebrow: string;
  value: string;
  meta?: string;
  accent?: boolean;
  valueClass?: string;
  marker?: string;
  index: number;
};

function StatBlock({
  eyebrow,
  value,
  meta,
  accent,
  valueClass,
  marker,
  index,
}: StatBlockProps) {
  return (
    <div
      className={[
        "relative border-t border-ink px-5 py-7",
        // separador vertical sutil entre colunas em telas maiores
        index > 0 ? "lg:border-l lg:border-rule" : "",
        index > 0 && index % 2 !== 0 ? "sm:border-l sm:border-rule" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="num text-[10px] text-ink-soft">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        {marker && (
          <span
            className="inline-block h-3 w-3 -translate-y-1 rounded-full"
            style={{ backgroundColor: marker }}
            aria-hidden
          />
        )}
        <span
          className={[
            "num text-3xl md:text-[2.5rem] leading-none tracking-tight",
            accent ? "text-stamp" : "text-ink",
            valueClass ?? "",
          ].join(" ")}
        >
          {value}
        </span>
      </div>

      {meta && <p className="mt-3 text-xs italic text-ink-soft">{meta}</p>}
    </div>
  );
}
