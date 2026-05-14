import { format } from "date-fns";
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
    <article className="relative border-t border-ink pt-6">
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="num text-xs text-ink-soft">IV</span>
        <h2 className="font-display text-2xl text-ink">
          Folha de <span className="italic text-ink-soft">lançamentos</span>
        </h2>
        <span className="ml-auto inline-flex items-center gap-2 eyebrow">
          <ReceiptText className="h-3.5 w-3.5 text-ledger" />
          {loading ? "..." : `${rows.length} registros`}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto border-y border-ink bg-paper/70">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-ink bg-paper-deep/70">
              <th className="eyebrow w-14 px-3 py-3 text-left">Nº</th>
              <th className="eyebrow w-28 px-3 py-3 text-left">Data</th>
              <th className="eyebrow px-3 py-3 text-left">Descrição</th>
              <th className="eyebrow w-44 px-3 py-3 text-left">Categoria</th>
              <th className="eyebrow w-36 px-3 py-3 text-right">Valor BRL</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-dashed border-rule">
                    <td className="px-3 py-4">
                      <Skeleton className="h-3 w-6" />
                    </td>
                    <td className="px-3 py-4">
                      <Skeleton className="h-3 w-16" />
                    </td>
                    <td className="px-3 py-4">
                      <Skeleton className="h-3 w-56" />
                    </td>
                    <td className="px-3 py-4">
                      <Skeleton className="h-3 w-28" />
                    </td>
                    <td className="px-3 py-4 text-right">
                      <Skeleton className="ml-auto h-3 w-24" />
                    </td>
                  </tr>
                ))
              : rows.length === 0
                ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center font-display italic text-ink-soft"
                    >
                      Nada para listar no período.
                    </td>
                  </tr>
                )
                : rows.map((e, i) => {
                    const meta = CATEGORY_META[e.category];
                    return (
                      <tr
                        key={e.id}
                        className="group border-b border-dashed border-rule transition-colors last:border-b-0 hover:bg-ledger-soft/45"
                      >
                        <td className="num px-3 py-4 text-[10px] text-ink-faint">
                          {String(i + 1).padStart(3, "0")}
                        </td>
                        <td className="num px-3 py-4 text-sm text-ink">
                          {format(new Date(e.occurred_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </td>
                        <td className="px-3 py-4">
                          <span className="block max-w-[420px] truncate font-display text-base capitalize text-ink">
                            {e.description}
                          </span>
                          {e.raw_message && (
                            <span className="mt-1 block max-w-[420px] truncate text-xs italic text-ink-faint">
                              {e.raw_message}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className="inline-flex max-w-full items-center gap-2 border border-current/20 bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                            style={{ color: meta.color }}
                          >
                            <span
                              aria-hidden
                              className="inline-block h-2 w-2 shrink-0"
                              style={{ backgroundColor: meta.color }}
                            />
                            <span className="truncate">{meta.label}</span>
                          </span>
                        </td>
                        <td className="num px-3 py-4 text-right text-base text-stamp">
                          {formatCurrency(e.amount)}
                        </td>
                      </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
