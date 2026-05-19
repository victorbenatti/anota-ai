import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyComparison } from "@/hooks/useMonthlyComparison";
import { formatCurrency } from "@/lib/utils";

type MonthComparisonCardProps = {
  refreshKey?: number;
};

export function MonthComparisonCard({ refreshKey = 0 }: MonthComparisonCardProps) {
  const { current, previous, deltaPercent, hasPrevious, loading } =
    useMonthlyComparison(refreshKey);

  const monthName = format(new Date(), "MMMM", { locale: ptBR });

  if (loading) {
    return <Skeleton className="h-[124px] w-full rounded-xl" />;
  }

  // Pra gastos: subir é ruim (stamp/vermelho), descer é bom (accent/lima)
  const isUp = deltaPercent > 0;
  const isDown = deltaPercent < 0;
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const trendColor = isUp
    ? "text-stamp bg-stamp/10"
    : isDown
      ? "text-accent bg-accent/15"
      : "text-ink-muted bg-surface-muted";
  const deltaLabel = `${isUp ? "+" : ""}${deltaPercent.toFixed(1)}%`;

  return (
    <div className="card-soft flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="flex-1">
        <span className="eyebrow">Comparativo mensal</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="num text-3xl font-bold text-stamp">
            {formatCurrency(current)}
          </span>
          <span className="text-sm font-medium capitalize text-ink-soft">
            em {monthName}
          </span>
        </div>
      </div>

      {hasPrevious ? (
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${trendColor}`}
          >
            <TrendIcon className="h-4 w-4" strokeWidth={2.5} />
            <span className="num">{deltaLabel}</span>
          </span>
          <div className="text-xs leading-tight text-ink-muted">
            vs mês passado
            <br />
            <span className="num text-ink-soft">{formatCurrency(previous)}</span>
          </div>
        </div>
      ) : (
        <div className="text-xs italic text-ink-muted md:text-right">
          Sem dados do mês anterior pra comparar.
        </div>
      )}
    </div>
  );
}
