import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
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
    <article className="card-soft p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-brand">
          <PieIcon className="h-4 w-4" strokeWidth={2} />
        </span>
        <h2 className="text-base font-semibold text-ink">Por categoria</h2>
      </div>

      {loading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded-md" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-muted">
          Nenhum lançamento para distribuir.
        </p>
      ) : (
        <div className="mt-5">
          <div className="relative mx-auto h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="hsl(var(--surface))"
                  strokeWidth={3}
                >
                  {data.map((d) => (
                    <Cell key={d.category} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--line))",
                    borderRadius: 10,
                    boxShadow: "0 4px 16px hsl(168 30% 14% / 0.1)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                  formatter={(value: number, _name, item) => {
                    const pct = total > 0 ? (value / total) * 100 : 0;
                    return [
                      `${formatCurrency(value)} · ${pct.toFixed(0)}%`,
                      String(item?.payload?.label ?? ""),
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="eyebrow">Total</span>
              <span className="num mt-0.5 text-base font-semibold text-stamp">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <ul className="mt-5 space-y-1">
            {data.map((d) => {
              const pct = total > 0 ? (d.value / total) * 100 : 0;
              return (
                <li
                  key={d.category}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted"
                >
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="flex-1 truncate text-sm text-ink">
                    {d.label}
                  </span>
                  <span className="num text-xs text-ink-muted">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="num w-24 text-right text-sm font-medium text-ink">
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
