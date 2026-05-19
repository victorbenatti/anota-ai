import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PeriodChips } from "@/components/PeriodChips";
import type {
  PeriodPreset,
  PeriodRange,
  Transaction,
} from "@/types/transaction";
import { amountToneClass, cn, formatCurrency } from "@/lib/utils";

type WeeklyTrendChartProps = {
  transactions: Transaction[];
  range: PeriodRange;
  loading: boolean;
  period: PeriodPreset;
  onPeriodChange: (preset: PeriodPreset) => void;
};

type DayDatum = {
  date: Date;
  label: string;
  income: number;
  expense: number;
  balance: number;
  cumulative: number;
};

export function WeeklyTrendChart({
  transactions,
  range,
  loading,
  period,
  onPeriodChange,
}: WeeklyTrendChartProps) {
  const [showCumulative, setShowCumulative] = useState(true);

  const data = useMemo<DayDatum[]>(() => {
    const days = eachDayOfInterval({ start: range.from, end: range.to });
    const labelFmt = days.length > 14 ? "dd" : "EEE";

    let runningBalance = 0;
    return days.map((d) => {
      let income = 0;
      let expense = 0;
      for (const transaction of transactions) {
        if (!isSameDay(parseISO(transaction.occurred_at), d)) continue;
        if (transaction.transaction_type === "income") income += transaction.amount;
        else expense += transaction.amount;
      }
      const dayBalance = income - expense;
      runningBalance += dayBalance;

      return {
        date: d,
        label: format(d, labelFmt, { locale: ptBR }).replace(".", ""),
        income: income / 100,
        expense: expense / 100,
        balance: dayBalance / 100,
        cumulative: runningBalance / 100,
      };
    });
  }, [transactions, range.from, range.to]);

  const incomeTotal = data.reduce((acc, d) => acc + d.income, 0);
  const expenseTotal = data.reduce((acc, d) => acc + d.expense, 0);
  const balanceTotal = incomeTotal - expenseTotal;

  return (
    <article className="card-soft p-5">
      {/* Linha 1: título + saldo total */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-brand">
            <TrendingUp className="h-4 w-4" strokeWidth={2} />
          </span>
          <h2 className="text-base font-semibold text-ink">
            Receita x despesa por dia
            <span className="ml-2 text-xs font-normal text-ink-muted">
              · {data.length} {data.length === 1 ? "dia" : "dias"}
            </span>
          </h2>
        </div>
        <span
          className={cn(
            "num shrink-0 text-sm font-semibold",
            amountToneClass("balance", balanceTotal)
          )}
        >
          Saldo {formatCurrency(Math.round(balanceTotal * 100))}
        </span>
      </div>

      {/* Linha 2: chips de período + toggle do saldo running */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <PeriodChips value={period} onChange={onPeriodChange} />
        <button
          type="button"
          onClick={() => setShowCumulative((v) => !v)}
          aria-pressed={showCumulative}
          title={showCumulative ? "Ocultar linha de saldo" : "Mostrar linha de saldo"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
            showCumulative
              ? "border-brand/40 bg-brand/10 text-brand"
              : "border-line bg-surface text-ink-soft hover:text-ink"
          )}
        >
          <Activity className="h-3.5 w-3.5" strokeWidth={2.5} />
          Saldo acumulado
        </button>
      </div>

      {loading ? (
        <Skeleton className="mt-5 h-[260px] w-full rounded-lg" />
      ) : (
        <div className="mt-5 h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: showCumulative ? 4 : 4, left: -16, bottom: 0 }}
            >
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
              {/* Eixo Y esquerdo — fluxo diário (receitas/despesas) */}
              <YAxis
                yAxisId="flow"
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
              {/* Eixo Y direito — saldo acumulado (só renderiza se a linha estiver visível) */}
              {showCumulative && (
                <YAxis
                  yAxisId="cumulative"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fill: "hsl(var(--brand))",
                  }}
                  tickFormatter={(v: number) => (v === 0 ? "" : `${v.toFixed(0)}`)}
                  width={44}
                />
              )}
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "hsl(var(--ink-muted))",
                }}
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
                formatter={(value: number, name: string) => {
                  const label =
                    name === "income"
                      ? "Receitas"
                      : name === "expense"
                        ? "Despesas"
                        : name === "cumulative"
                          ? "Saldo acumulado"
                          : "Saldo";
                  return [formatCurrency(Math.round(value * 100)), label];
                }}
                labelFormatter={(label, payload) => {
                  const d = payload?.[0]?.payload?.date as Date | undefined;
                  return d
                    ? format(d, "EEEE, dd/MM", { locale: ptBR })
                    : String(label);
                }}
              />
              <Bar
                yAxisId="flow"
                dataKey="income"
                name="Receitas"
                fill="hsl(var(--accent))"
                radius={[6, 6, 0, 0]}
                maxBarSize={34}
              />
              <Bar
                yAxisId="flow"
                dataKey="expense"
                name="Despesas"
                fill="hsl(var(--stamp))"
                radius={[6, 6, 0, 0]}
                maxBarSize={34}
              />
              {showCumulative && (
                <Line
                  yAxisId="cumulative"
                  type="monotone"
                  dataKey="cumulative"
                  name="Saldo acumulado"
                  stroke="hsl(var(--brand))"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "hsl(var(--brand))",
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "hsl(var(--brand))",
                    strokeWidth: 2,
                    stroke: "hsl(var(--surface))",
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
