import { CalendarRange } from "lucide-react";

type FilterBarProps = {
  rangeLabel: string;
};

export function FilterBar({ rangeLabel }: FilterBarProps) {
  return (
    <div className="flex min-h-12 items-center gap-3 border border-ink bg-paper px-3 py-2 shadow-[3px_3px_0_hsl(var(--ink))]">
      <div className="flex min-w-0 items-center gap-3">
        <CalendarRange className="h-4 w-4 shrink-0 text-ledger" />
        <div className="min-w-0">
          <div className="whitespace-nowrap font-sans text-sm font-bold text-ink">
            Esta semana
          </div>
          <div className="num mt-0.5 whitespace-nowrap text-[10px] text-ink-soft">
            {rangeLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
