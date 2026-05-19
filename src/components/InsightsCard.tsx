import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights, type Insight, type InsightTone } from "@/hooks/useInsights";
import type { PeriodRange, Transaction } from "@/types/transaction";
import { cn } from "@/lib/utils";

type InsightsCardProps = {
  transactions: Transaction[];
  range: PeriodRange;
  loading: boolean;
};

// Mostra de 3 a 4 insights interpretados a partir das transações do período.
// Se não houver dado suficiente, retorna null silenciosamente.
export function InsightsCard({ transactions, range, loading }: InsightsCardProps) {
  const insights = useInsights({ transactions, range });

  if (loading) {
    return <Skeleton className="h-[120px] w-full rounded-xl" />;
  }

  if (insights.length === 0) return null;

  // Mostra no máximo 4 insights
  const displayed = insights.slice(0, 4);

  return (
    <article className="card-soft p-5">
      <header className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Lightbulb className="h-4 w-4" strokeWidth={2} />
        </span>
        <h2 className="text-base font-semibold text-ink">
          Insights{" "}
          <span className="ml-1 text-xs font-normal text-ink-muted">
            · {displayed.length} no período
          </span>
        </h2>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {displayed.map((insight) => (
          <InsightItem key={insight.id} insight={insight} />
        ))}
      </ul>
    </article>
  );
}

function InsightItem({ insight }: { insight: Insight }) {
  const Icon = insight.icon;
  const { iconWrap, ring } = toneStyles(insight.tone);

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-surface-muted/40 p-3.5 transition-colors hover:bg-surface-muted",
        ring
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          iconWrap
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight text-ink">
          {insight.title}
        </p>
        <p className="mt-1 text-xs leading-snug text-ink-soft">
          {insight.description}
        </p>
      </div>
    </li>
  );
}

function toneStyles(tone: InsightTone): { iconWrap: string; ring: string } {
  switch (tone) {
    case "positive":
      return {
        iconWrap: "bg-accent/15 text-accent",
        ring: "border-accent/20",
      };
    case "alert":
      return {
        iconWrap: "bg-stamp/10 text-stamp",
        ring: "border-stamp/20",
      };
    case "neutral":
      return {
        iconWrap: "bg-surface text-brand",
        ring: "border-line",
      };
  }
}
