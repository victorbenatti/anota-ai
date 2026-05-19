import { PERIOD_LABELS, type PeriodPreset } from "@/types/transaction";
import { cn } from "@/lib/utils";

type PeriodChipsProps = {
  value: PeriodPreset;
  onChange: (preset: PeriodPreset) => void;
  className?: string;
  size?: "sm" | "md";
};

// Chips horizontais pra escolher o período. Compartilha estado com o FilterBar
// do header — basta passar o mesmo value/onChange. Em mobile vira scroll horizontal.
export function PeriodChips({
  value,
  onChange,
  className,
  size = "sm",
}: PeriodChipsProps) {
  return (
    <div
      role="tablist"
      aria-label="Período de análise"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1",
        "max-w-full overflow-x-auto",
        className
      )}
    >
      {(Object.keys(PERIOD_LABELS) as PeriodPreset[]).map((preset) => {
        const active = preset === value;
        return (
          <button
            key={preset}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(preset)}
            className={cn(
              "whitespace-nowrap rounded-md font-semibold transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active
                ? "bg-brand text-white shadow-sm"
                : "text-ink-soft hover:bg-surface-muted hover:text-ink"
            )}
          >
            {PERIOD_LABELS[preset]}
          </button>
        );
      })}
    </div>
  );
}
