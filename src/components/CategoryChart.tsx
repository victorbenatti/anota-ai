import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_META } from "@/types/expense";
import type { Expense, ExpenseCategory } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";

type CategoryChartProps = {
  expenses: Expense[];
  loading: boolean;
};

type SliceDatum = {
  category: ExpenseCategory;
  label: string;
  value: number;
  color: string;
};

export function CategoryChart({ expenses, loading }: CategoryChartProps) {
  const data = useMemo<SliceDatum[]>(() => {
    const totals = new Map<ExpenseCategory, number>();
    for (const e of expenses) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }
    return Array.from(totals.entries())
      .map(([cat, value]) => ({
        category: cat,
        label: CATEGORY_META[cat].label,
        color: CATEGORY_META[cat].color,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <article className="relative border-t border-ink pt-6">
      <SectionHead number="II" title="Distribuição" subtitle="Por categoria" />

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[260px] w-full rounded-full" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      ) : data.length === 0 ? (
        <Empty />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] md:items-center">
          <div className="relative mx-auto h-[260px] w-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={84}
                  outerRadius={120}
                  paddingAngle={1.5}
                  stroke="hsl(var(--paper))"
                  strokeWidth={2}
                >
                  {data.map((d) => (
                    <Cell key={d.category} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: "hsl(var(--paper))",
                    border: "1px solid hsl(var(--ink))",
                    borderRadius: 2,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                  formatter={(value: number, _name, item) => {
                    const pct = total > 0 ? (value / total) * 100 : 0;
                    return [
                      `${formatCurrency(value)}  ·  ${pct.toFixed(1)}%`,
                      String(item?.payload?.label ?? ""),
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="eyebrow">Total</span>
              <span className="num mt-1 text-xl text-ink">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <ul className="space-y-0 self-stretch md:self-center">
            {data.map((d, i) => {
              const pct = total > 0 ? (d.value / total) * 100 : 0;
              return (
                <li
                  key={d.category}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-dashed border-rule py-2 last:border-b-0"
                >
                  <span className="num text-[10px] text-ink-faint w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2 font-display">
                    <span
                      aria-hidden
                      className="inline-block h-2.5 w-2.5"
                      style={{ backgroundColor: d.color }}
                    />
                    {d.label}
                  </span>
                  <span className="num text-xs text-ink-soft">
                    {pct.toFixed(1)}%
                  </span>
                  <span className="num text-sm text-ink">
                    {formatCurrency(d.value)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </article>
  );
}

function Empty() {
  return (
    <p className="mt-10 text-center font-display italic text-ink-soft">
      Nenhum lançamento para distribuir.
    </p>
  );
}

function SectionHead({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="num text-xs text-ink-soft">{number}</span>
      <h2 className="font-display text-2xl text-ink">
        {title}
        {subtitle && (
          <span className="ml-2 italic text-ink-soft">— {subtitle}</span>
        )}
      </h2>
    </div>
  );
}
