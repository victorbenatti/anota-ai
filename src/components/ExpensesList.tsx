import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
      <div className="flex items-baseline gap-4">
        <span className="num text-xs text-ink-soft">IV</span>
        <h2 className="font-display text-2xl text-ink">
          Folha de <span className="italic text-ink-soft">lançamentos</span>
        </h2>
        <span className="ml-auto eyebrow">
          {loading ? "—" : `${rows.length} registros`}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-ink/80">
              <th className="eyebrow w-12 py-2 text-left">№</th>
              <th className="eyebrow w-20 py-2 text-left">Data</th>
              <th className="eyebrow py-2 text-left">Descrição</th>
              <th className="eyebrow w-40 py-2 text-left">Categoria</th>
              <th className="eyebrow w-32 py-2 text-right">Valor (BRL)</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-dashed border-rule">
                    <td className="py-3"><Skeleton className="h-3 w-6" /></td>
                    <td className="py-3"><Skeleton className="h-3 w-12" /></td>
                    <td className="py-3"><Skeleton className="h-3 w-48" /></td>
                    <td className="py-3"><Skeleton className="h-3 w-24" /></td>
                    <td className="py-3 text-right"><Skeleton className="ml-auto h-3 w-20" /></td>
                  </tr>
                ))
              : rows.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center font-display italic text-ink-soft">
                      Nada para listar no período.
                    </td>
                  </tr>
                )
                : rows.map((e, i) => {
                    const meta = CATEGORY_META[e.category];
                    return (
                      <tr
                        key={e.id}
                        className="group border-b border-dashed border-rule transition-colors hover:bg-paper-deep/60"
                      >
                        <td className="num py-3 text-[10px] text-ink-faint">
                          {String(i + 1).padStart(3, "0")}
                        </td>
                        <td className="num py-3 text-sm text-ink">
                          {format(new Date(e.occurred_at), "dd/MM", { locale: ptBR })}
                        </td>
                        <td className="py-3">
                          <span className="font-display text-base capitalize">
                            {e.description}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]"
                            style={{ color: meta.color }}
                          >
                            <span
                              aria-hidden
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: meta.color }}
                            />
                            {meta.label}
                          </span>
                        </td>
                        <td className="num py-3 text-right text-base text-stamp">
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
