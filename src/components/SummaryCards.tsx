import { useMemo } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  Percent,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PeriodRange, Transaction } from "@/types/transaction";
import { amountToneClass, cn, formatCurrency, type AmountTone } from "@/lib/utils";

type SummaryCardsProps = {
  transactions: Transaction[];
  range: PeriodRange;
  loading: boolean;
};

function useSummary(transactions: Transaction[], range: PeriodRange) {
  return useMemo(() => {
    let income = 0;
    let expense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    for (const transaction of transactions) {
      if (transaction.transaction_type === "income") {
        income += transaction.amount;
        incomeCount += 1;
      } else {
        expense += transaction.amount;
        expenseCount += 1;
      }
    }

    const balance = income - expense;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    return { income, expense, balance, savingsRate, incomeCount, expenseCount };
  }, [transactions, range.from, range.to]);
}

export function SummaryCards({ transactions, range, loading }: SummaryCardsProps) {
  const { income, expense, balance, savingsRate, incomeCount, expenseCount } =
    useSummary(transactions, range);

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <Skeleton className="h-[240px] w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalCount = incomeCount + expenseCount;

  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      <HeroBalance
        balance={balance}
        income={income}
        expense={expense}
        totalCount={totalCount}
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <CompactStat
          icon={ArrowUpCircle}
          label="Receitas"
          value={formatCurrency(income)}
          hint={`${incomeCount} ${incomeCount === 1 ? "entrada" : "entradas"}`}
          tone="income"
        />
        <CompactStat
          icon={ArrowDownCircle}
          label="Despesas"
          value={formatCurrency(expense)}
          hint={`${expenseCount} ${expenseCount === 1 ? "saída" : "saídas"}`}
          tone="expense"
        />
        <CompactStat
          icon={Percent}
          label="Taxa de sobra"
          value={income > 0 ? `${savingsRate.toFixed(0)}%` : "—"}
          hint={
            income > 0 ? "do que entrou, sobrou" : "sem receitas no período"
          }
          tone="neutral"
          textValue
        />
      </div>
    </div>
  );
}

// ---------- Hero card (esquerda, grande) ----------

type HeroBalanceProps = {
  balance: number;
  income: number;
  expense: number;
  totalCount: number;
};

function HeroBalance({ balance, income, expense, totalCount }: HeroBalanceProps) {
  const isPositive = balance >= 0;
  return (
    <div className="card-soft relative flex flex-col justify-between overflow-hidden p-6 md:p-8">
      {/* Mesh decorativo discreto no canto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: isPositive
            ? "radial-gradient(ellipse 50% 60% at 100% 0%, hsl(75 60% 45% / 0.10), transparent 60%)"
            : "radial-gradient(ellipse 50% 60% at 100% 0%, hsl(2 62% 47% / 0.08), transparent 60%)",
        }}
      />

      <header className="relative flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Saldo do período</span>
          <p className="mt-1 text-xs text-ink-muted">
            {totalCount} {totalCount === 1 ? "lançamento" : "lançamentos"} no
            total
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-brand">
          <Landmark className="h-5 w-5" strokeWidth={2} />
        </span>
      </header>

      <div className="relative my-6">
        <p
          className={cn(
            "num text-4xl font-bold leading-none tracking-tight md:text-5xl lg:text-[3.25rem]",
            amountToneClass("balance", balance)
          )}
        >
          {formatCurrency(balance)}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {balance > 0
            ? "Você fechou no positivo."
            : balance < 0
              ? "Despesas maiores que receitas no período."
              : "Sem movimento no período."}
        </p>
      </div>

      <footer className="relative flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <BreakdownItem
          icon={ArrowUpCircle}
          label="Receitas"
          value={income}
          tone="income"
        />
        <BreakdownItem
          icon={ArrowDownCircle}
          label="Despesas"
          value={expense}
          tone="expense"
          align="right"
        />
      </footer>
    </div>
  );
}

function BreakdownItem({
  icon: Icon,
  label,
  value,
  tone,
  align = "left",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: AmountTone;
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        align === "right" && "flex-row-reverse text-right"
      )}
    >
      <Icon
        className={cn("h-5 w-5 shrink-0", amountToneClass(tone))}
        strokeWidth={2}
      />
      <div className={cn(align === "right" && "text-right")}>
        <span className="text-[11px] uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        <p className={cn("num text-base font-semibold", amountToneClass(tone))}>
          {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
}

// ---------- Compact stats (direita, empilhados) ----------

type CompactStatProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  tone: AmountTone;
  textValue?: boolean;
};

function CompactStat({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  textValue,
}: CompactStatProps) {
  return (
    <div className="card-soft flex items-center gap-4 p-4 transition-shadow hover:shadow-soft-md">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-brand">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <span className="eyebrow">{label}</span>
        <p
          className={cn(
            "leading-tight",
            textValue
              ? "truncate text-lg font-bold"
              : "num text-xl font-semibold",
            amountToneClass(tone)
          )}
        >
          {value}
        </p>
      </div>

      <span className="hidden text-right text-[10px] uppercase tracking-wider text-ink-muted sm:block lg:block">
        {hint}
      </span>
    </div>
  );
}

