import { CalendarRange } from "lucide-react";

type FilterBarProps = {
  rangeLabel: string;
};

// Componente apresentacional — o dashboard opera em visão semanal fixa.
export function FilterBar({ rangeLabel }: FilterBarProps) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2 shadow-soft">
      <CalendarRange className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-ink">Esta semana</div>
        <div className="num text-[11px] text-ink-muted">{rangeLabel}</div>
      </div>
    </div>
  );
}
