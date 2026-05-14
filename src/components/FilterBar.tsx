import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PeriodPreset } from "@/types/expense";

type FilterBarProps = {
  value: PeriodPreset;
  onChange: (preset: PeriodPreset) => void;
};

const OPTIONS: { value: PeriodPreset; label: string }[] = [
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mês" },
  { value: "last30", label: "Últimos 30 dias" },
];

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PeriodPreset)}>
      <SelectTrigger
        className="h-auto w-auto justify-end gap-2 border-0 border-b border-ink/40 rounded-none bg-transparent px-0 py-1 font-display text-lg italic shadow-none focus:ring-0 focus:border-stamp hover:border-ink"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-ink/30 bg-paper">
        {OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="font-display italic"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
