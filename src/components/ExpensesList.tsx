import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ReceiptText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_META } from "@/types/expense";
import type { Expense } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";

type ExpensesListProps = {
  expenses: Expense[];
  loading: boolean;
};

export function ExpensesList({ expenses, loading }: ExpensesListProps) {
  const rows = expenses.slice(0, 20);

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
              <Skeleton className="h-4 w-16" />
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
          {rows.map((e) => {
            const meta = CATEGORY_META[e.category];
            return (
              <li
                key={e.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted"
              >
                <span className="num w-14 shrink-0 text-xs text-ink-muted">
                  {format(parseISO(e.occurred_at), "dd/MM", { locale: ptBR })}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium capitalize text-ink">
                    {e.description}
                  </p>
                  {e.raw_message && (
                    <p className="truncate text-xs text-ink-muted">
                      {e.raw_message}
                    </p>
                  )}
                </div>

                <span
                  className="hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex"
                  style={{
                    backgroundColor: `${meta.color}14`,
                    color: meta.color,
                  }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.label}
                </span>

                <span className="num w-24 shrink-0 text-right text-sm font-semibold text-stamp">
                  {formatCurrency(e.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
