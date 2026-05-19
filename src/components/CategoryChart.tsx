import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EXPENSE_CATEGORY_META,
  INCOME_CATEGORY_META,
  isExpenseCategory,
  isIncomeCategory,
} from "@/types/transaction";
import type {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
} from "@/types/transaction";
import { formatCurrency } from "@/lib/utils";

type CategoryChartProps = {
  transactions: Transaction[];
  loading: boolean;
};

type ExpenseSliceDatum = {
  category: ExpenseCategory;
  label: string;
  value: number;
  color: string;
};

type IncomeSourceDatum = {
  category: IncomeCategory;
  label: string;
  value: number;
  color: string;
};

export function CategoryChart({ transactions, loading }: CategoryChartProps) {
  const { expenseData, incomeData } = useMemo(() => {
    const expenseTotals = new Map<ExpenseCategory, number>();
    const incomeTotals = new Map<IncomeCategory, number>();

    for (const transaction of transactions) {
      if (
        transaction.transaction_type === "income" &&
        isIncomeCategory(transaction.category)
      ) {
        incomeTotals.set(
          transaction.category,
          (incomeTotals.get(transaction.category) ?? 0) + transaction.amount
        );
      } else if (
        transaction.transaction_type === "expense" &&
        isExpenseCategory(transaction.category)
      ) {
        expenseTotals.set(
          transaction.category,
          (expenseTotals.get(transaction.category) ?? 0) + transaction.amount
        );
      }
    }

    return {
      expenseData: Array.from(expenseTotals.entries())
        .map(([cat, value]) => ({
          category: cat,
          label: EXPENSE_CATEGORY_META[cat].label,
          color: EXPENSE_CATEGORY_META[cat].color,
          value,
        }))
        .sort((a, b) => b.value - a.value),
      incomeData: Array.from(incomeTotals.entries())
        .map(([cat, value]) => ({
          category: cat,
          label: INCOME_CATEGORY_META[cat].label,
          color: INCOME_CATEGORY_META[cat].color,
          value,
        }))
        .sort((a, b) => b.value - a.value),
    };
  }, [transactions]);

  const expenseTotal = expenseData.reduce((acc, d) => acc + d.value, 0);
  const incomeTotal = incomeData.reduce((acc, d) => acc + d.value, 0);

  return (
    <article className="card-soft p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-brand">
          <PieIcon className="h-4 w-4" strokeWidth={2} />
        </span>
        <h2 className="text-base font-semibold text-ink">
          Despesas por categoria
        </h2>
      </div>

      {loading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded-md" />
          ))}
        </div>
      ) : expenseData.length === 0 && incomeData.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-muted">
          Nenhum lançamento para distribuir.
        </p>
      ) : (
        <div className="mt-5 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ExpenseDistribution data={expenseData} total={expenseTotal} />
          <IncomeSources data={incomeData} total={incomeTotal} />
        </div>
      )}
    </article>
  );
}

function ExpenseDistribution({
  data,
  total,
}: {
  data: ExpenseSliceDatum[];
  total: number;
}) {
  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-ink-muted">
        Sem despesas no período.
      </p>
    );
  }

  return (
    <div>
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
          <span className="eyebrow">Despesas</span>
          <span className="num mt-0.5 text-base font-semibold text-stamp">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <CategoryRows data={data} total={total} />
    </div>
  );
}

function IncomeSources({
  data,
  total,
}: {
  data: IncomeSourceDatum[];
  total: number;
}) {
  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-ink-muted">
        Sem receitas no período.
      </p>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow">Origem das receitas</span>
        <span className="num text-sm font-semibold text-accent">
          {formatCurrency(total)}
        </span>
      </div>
      <CategoryRows data={data} total={total} />
    </div>
  );
}

function CategoryRows({
  data,
  total,
}: {
  data: Array<ExpenseSliceDatum | IncomeSourceDatum>;
  total: number;
}) {
  return (
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
            <span className="flex-1 truncate text-sm text-ink">{d.label}</span>
            <span className="num text-xs text-ink-muted">{pct.toFixed(0)}%</span>
            <span className="num w-24 text-right text-sm font-medium text-ink">
              {formatCurrency(d.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
