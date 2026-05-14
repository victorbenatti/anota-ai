import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell as RCell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import type { Expense } from "@/types/expense";
import type { PeriodRange } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";

type WeeklyTrendChartProps = {
  expenses: Expense[];
  range: PeriodRange;
  loading: boolean;
};

type DayDatum = {
  date: Date;
  label: string;
  total: number;
};

export function WeeklyTrendChart({ expenses, range, loading }: WeeklyTrendChartProps) {
  const data = useMemo<DayDatum[]>(() => {
    const days = eachDayOfInterval({ start: range.from, end: range.to });
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
  }, [expenses, range.from, range.to]);

  const max = Math.max(...data.map((d) => d.total), 0);
  const peakIdx = data.findIndex((d) => d.total === max && max > 0);
  const activeDays = data.filter((d) => d.total > 0).length;
  const weeklyTotal = data.reduce((acc, d) => acc + d.total, 0);

  return (
    <article className="relative border-t border-ink pt-6">
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="num text-xs text-ink-soft">II</span>
        <h2 className="font-display text-2xl text-ink">
          Cadência <span className="italic text-ink-soft">/ 7 dias</span>
        </h2>
        <span className="ml-auto eyebrow">
          {activeDays} de 7 dias ativos
        </span>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-[280px] w-full" />
      ) : (
        <div className="mt-6 h-[280px] w-full border-l border-b border-rule/70 bg-paper/40 pr-2 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 18, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--ink))" }}
                tick={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fill: "hsl(var(--ink-soft))",
                }}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fill: "hsl(var(--ink-faint))",
                }}
                tickFormatter={(v: number) => (v === 0 ? "" : `${v.toFixed(0)}`)}
                width={36}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--ledger) / 0.08)" }}
                contentStyle={{
                  background: "hsl(var(--paper))",
                  border: "1px solid hsl(var(--ink))",
                  borderRadius: 2,
                  boxShadow: "4px 4px 0 hsl(var(--ink))",
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
              <Bar dataKey="total" radius={[2, 2, 0, 0]} maxBarSize={34}>
                {data.map((d, i) => (
                  <RCell
                    key={i}
                    fill={
                      d.total === 0
                        ? "hsl(var(--ink) / 0.08)"
                        : i === peakIdx
                          ? "hsl(var(--stamp))"
                          : "hsl(var(--ledger))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-rule pt-3">
          <p className="text-xs italic text-ink-soft">
            Soma semanal{" "}
            <span className="num not-italic text-stamp">
              {formatCurrency(Math.round(weeklyTotal * 100))}
            </span>
          </p>
          {max > 0 && peakIdx >= 0 && (
            <p className="text-right text-xs italic text-ink-soft">
              Pico{" "}
              <span className="font-mono not-italic text-ink">
                {data[peakIdx]?.label}
              </span>{" "}
              <span className="num not-italic text-stamp">
                {formatCurrency(Math.round(max * 100))}
              </span>
            </p>
          )}
        </div>
      )}
    </article>
  );
}
