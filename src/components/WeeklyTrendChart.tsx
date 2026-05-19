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
import { eachDayOfInterval, format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Expense, PeriodRange } from "@/types/expense";
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

export function WeeklyTrendChart({
  expenses,
  range,
  loading,
}: WeeklyTrendChartProps) {
  const data = useMemo<DayDatum[]>(() => {
    const days = eachDayOfInterval({ start: range.from, end: range.to });
    // Em janelas longas (>14 dias) usa "dd" pra não embolar o eixo X.
    const labelFmt = days.length > 14 ? "dd" : "EEE";
    return days.map((d) => {
      const total = expenses
        .filter((e) => isSameDay(parseISO(e.occurred_at), d))
        .reduce((acc, e) => acc + e.amount, 0);
      return {
        date: d,
        label: format(d, labelFmt, { locale: ptBR }).replace(".", ""),
        total: total / 100,
      };
    });
  }, [expenses, range.from, range.to]);

  const max = Math.max(...data.map((d) => d.total), 0);
  const peakIdx = data.findIndex((d) => d.total === max && max > 0);
  const weeklyTotal = data.reduce((acc, d) => acc + d.total, 0);

  return (
    <article className="card-soft p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-brand">
            <TrendingUp className="h-4 w-4" strokeWidth={2} />
          </span>
          <h2 className="text-base font-semibold text-ink">
            Gasto por dia
            <span className="ml-2 text-xs font-normal text-ink-muted">
              · {data.length} {data.length === 1 ? "dia" : "dias"}
            </span>
          </h2>
        </div>
        <span className="num text-sm font-semibold text-stamp">
          {formatCurrency(Math.round(weeklyTotal * 100))}
        </span>
      </div>

      {loading ? (
        <Skeleton className="mt-5 h-[260px] w-full rounded-lg" />
      ) : (
        <div className="mt-5 h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fill: "hsl(var(--ink-muted))",
                }}
                interval={0}
                dy={4}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fill: "hsl(var(--ink-muted))",
                }}
                tickFormatter={(v: number) => (v === 0 ? "" : `${v.toFixed(0)}`)}
                width={44}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--ink) / 0.04)" }}
                contentStyle={{
                  background: "hsl(var(--surface))",
                  border: "1px solid hsl(var(--line))",
                  borderRadius: 10,
                  boxShadow: "0 4px 16px hsl(168 30% 14% / 0.1)",
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
              <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((d, i) => (
                  <RCell
                    key={i}
                    fill={
                      d.total === 0
                        ? "hsl(var(--line))"
                        : i === peakIdx
                          ? "hsl(var(--stamp))"
                          : "hsl(var(--brand))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
