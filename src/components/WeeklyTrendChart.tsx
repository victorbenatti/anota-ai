import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell as RCell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import type { Expense } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";

type WeeklyTrendChartProps = {
  expenses: Expense[];
  loading: boolean;
};

type DayDatum = {
  date: Date;
  label: string;
  total: number;
};

export function WeeklyTrendChart({ expenses, loading }: WeeklyTrendChartProps) {
  const data = useMemo<DayDatum[]>(() => {
    const today = new Date();
    const start = subDays(today, 6);
    const days = eachDayOfInterval({ start, end: today });
    return days.map((d) => {
      const total = expenses
        .filter((e) => isSameDay(new Date(e.occurred_at), d))
        .reduce((acc, e) => acc + e.amount, 0);
      return {
        date: d,
        label: format(d, "EEE", { locale: ptBR }).replace(".", ""),
        total: total / 100,
      };
    });
  }, [expenses]);

  const max = Math.max(...data.map((d) => d.total), 0);
  const peakIdx = data.findIndex((d) => d.total === max && max > 0);

  return (
    <article className="relative border-t border-ink pt-6">
      <div className="flex items-baseline gap-4">
        <span className="num text-xs text-ink-soft">III</span>
        <h2 className="font-display text-2xl text-ink">
          Cadência <span className="italic text-ink-soft">— 7 dias</span>
        </h2>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-[260px] w-full" />
      ) : (
        <div className="mt-6 h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--ink))" }}
                tick={{ fontFamily: "var(--font-mono)", fontSize: 11, fill: "hsl(var(--ink-soft))" }}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "hsl(var(--ink-faint))" }}
                tickFormatter={(v: number) => (v === 0 ? "" : `${v.toFixed(0)}`)}
                width={36}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--ink) / 0.06)" }}
                contentStyle={{
                  background: "hsl(var(--paper))",
                  border: "1px solid hsl(var(--ink))",
                  borderRadius: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
                formatter={(value: number) => [
                  formatCurrency(Math.round(value * 100)),
                  "Gasto",
                ]}
                labelFormatter={(label, payload) => {
                  const d = payload?.[0]?.payload?.date as Date | undefined;
                  return d
                    ? format(d, "EEEE, dd/MM", { locale: ptBR })
                    : String(label);
                }}
              />
              <Bar dataKey="total" radius={[2, 2, 0, 0]} maxBarSize={36}>
                {data.map((d, i) => (
                  <RCell
                    key={i}
                    fill={
                      d.total === 0
                        ? "hsl(var(--ink) / 0.08)"
                        : i === peakIdx
                          ? "hsl(var(--stamp))"
                          : "hsl(var(--ink))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && max > 0 && (
        <p className="mt-3 font-display text-xs italic text-ink-soft">
          Pico em <span className="font-mono not-italic text-ink">{data[peakIdx]?.label}</span>{" "}
          — {formatCurrency(Math.round(max * 100))}.
        </p>
      )}
    </article>
  );
}

