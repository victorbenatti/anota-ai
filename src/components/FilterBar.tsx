import { CalendarRange } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIOD_LABELS, type PeriodPreset } from "@/types/transaction";

type FilterBarProps = {
  value: PeriodPreset;
  onChange: (preset: PeriodPreset) => void;
  rangeLabel: string;
};

// Componente apresentacional — recebe o preset atual e callback de troca.
export function FilterBar({ value, onChange, rangeLabel }: FilterBarProps) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-lg border border-line bg-surface p-1.5 pl-3 shadow-soft">
      <CalendarRange className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />

      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={(v) => onChange(v as PeriodPreset)}>
          <SelectTrigger className="h-8 w-auto gap-2 border-0 bg-transparent px-2 text-sm font-semibold text-ink shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PERIOD_LABELS) as PeriodPreset[]).map((preset) => (
              <SelectItem key={preset} value={preset}>
                {PERIOD_LABELS[preset]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="num hidden text-[11px] text-ink-muted sm:inline">
          {rangeLabel}
        </span>
      </div>
    </div>
  );
}
