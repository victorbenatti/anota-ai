import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ReceiptText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_META } from "@/types/transaction";
import type { Transaction } from "@/types/transaction";
import { amountToneClass, cn, formatCurrency } from "@/lib/utils";

type TransactionsListProps = {
  transactions: Transaction[];
  loading: boolean;
};

export function TransactionsList({
  transactions,
  loading,
}: TransactionsListProps) {
  const rows = transactions.slice(0, 20);

  return (
    <article className="card-soft overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-brand">
            <ReceiptText className="h-4 w-4" strokeWidth={2} />
          </span>
          <h2 className="text-base font-semibold text-ink">
            Últimos lançamentos
          </h2>
        </div>
        <span className="num text-xs text-ink-muted">
          {loading ? "—" : `${rows.length} registros`}
        </span>
      </div>

      {loading ? (
        <div className="divide-y divide-line">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-ink-muted">
          Nada para listar no período.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((transaction) => {
            const meta = CATEGORY_META[transaction.category];
            const Icon = meta.icon;
            const isIncome = transaction.transaction_type === "income";
            return (
              <li
                key={transaction.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted"
              >
                {/* Badge circular com ícone da categoria */}
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${meta.color}1f`,
                    color: meta.color,
                  }}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium capitalize text-ink">
                    {transaction.description}
                  </p>
                  <p className="num text-xs text-ink-muted">
                    {format(parseISO(transaction.occurred_at), "dd/MM", {
                      locale: ptBR,
                    })}
                    <span className="mx-1.5 text-ink-muted/60">·</span>
                    <span className="capitalize">{meta.label}</span>
                  </p>
                </div>

                <span
                  className={cn(
                    "num w-24 shrink-0 text-right text-sm font-semibold",
                    amountToneClass(isIncome ? "income" : "expense")
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
