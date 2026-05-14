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
  const leader = data[0];
  const leaderShare = leader && total > 0 ? (leader.value / total) * 100 : 0;

  return (
    <article className="relative border-t border-ink pt-6">
      <SectionHead number="III" title="Distribuição" subtitle="categorias" />

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <Skeleton className="mx-auto h-[240px] w-[240px] rounded-full" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
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
                  innerRadius={82}
                  outerRadius={118}
                  paddingAngle={1.75}
                  stroke="hsl(var(--paper))"
                  strokeWidth={3}
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
                    boxShadow: "4px 4px 0 hsl(var(--ink))",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                  formatter={(value: number, _name, item) => {
                    const pct = total > 0 ? (value / total) * 100 : 0;
                    return [
                      `${formatCurrency(value)} / ${pct.toFixed(1)}%`,
                      String(item?.payload?.label ?? ""),
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="eyebrow">Total</span>
              <span className="num mt-1 text-xl text-stamp">
                {formatCurrency(total)}
              </span>
              {leader && (
                <span className="mt-2 max-w-[120px] text-xs italic leading-4 text-ink-soft">
                  {leader.label} lidera com {leaderShare.toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <ul className="space-y-3 self-stretch md:self-center">
            {data.map((d, i) => {
              const pct = total > 0 ? (d.value / total) * 100 : 0;
              return (
                <li
                  key={d.category}
                  className="border-b border-dashed border-rule pb-3 last:border-b-0"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <span className="num w-6 text-[10px] text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 items-center gap-2 font-display">
                      <span
                        aria-hidden
                        className="inline-block h-2.5 w-2.5 shrink-0 border border-ink/15"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="truncate">{d.label}</span>
                    </span>
                    <span className="num text-right text-sm text-stamp">
                      {formatCurrency(d.value)}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3 pl-9">
                    <div className="h-1.5 bg-paper-deep">
                      <div
                        className="h-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: d.color,
                        }}
                      />
                    </div>
                    <span className="num text-[10px] text-ink-soft">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
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
          <span className="ml-2 italic text-ink-soft">/ {subtitle}</span>
        )}
      </h2>
    </div>
  );
}
