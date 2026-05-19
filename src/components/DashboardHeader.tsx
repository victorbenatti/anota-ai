import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterBar } from "./FilterBar";
import type { PeriodPreset, PeriodRange } from "@/types/transaction";

type DashboardHeaderProps = {
  range: PeriodRange;
  period: PeriodPreset;
  onPeriodChange: (preset: PeriodPreset) => void;
  displayName?: string | null;
};

export function DashboardHeader({
  range,
  period,
  onPeriodChange,
  displayName,
}: DashboardHeaderProps) {
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const weekRange = `${format(range.from, "dd/MM", { locale: ptBR })} – ${format(
    range.to,
    "dd/MM",
    { locale: ptBR }
  )}`;
  const firstName = displayName?.split(" ")[0];

  return (
    <header className="reveal mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium capitalize text-ink-muted">{today}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {firstName ? `Olá, ${firstName}` : "Painel financeiro"}
        </h1>
        <p className="mt-1.5 max-w-md text-sm text-ink-soft">
          Resumo do período: o que entrou, o que saiu, o saldo e os últimos
          lançamentos.
        </p>
      </div>
      <FilterBar
        value={period}
        onChange={onPeriodChange}
        rangeLabel={weekRange}
      />
    </header>
  );
}
