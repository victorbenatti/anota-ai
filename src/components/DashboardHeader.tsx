import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterBar } from "./FilterBar";
import type { PeriodPreset } from "@/types/expense";

type DashboardHeaderProps = {
  period: PeriodPreset;
  onPeriodChange: (preset: PeriodPreset) => void;
};

export function DashboardHeader({
  period,
  onPeriodChange,
}: DashboardHeaderProps) {
  const today = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <header className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-12 md:items-end">
      <div className="md:col-span-9">
        <div className="flex items-center gap-3">
          <span className="eyebrow">Edição № 01</span>
          <span className="h-px flex-1 max-w-[120px] bg-ink/30" />
          <span className="eyebrow">{today}</span>
        </div>
        <h1
          className="display mt-3 text-[clamp(2.5rem,7vw,5.5rem)] font-light text-ink"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          Controle{" "}
          <em
            className="font-normal italic"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            Financeiro
          </em>
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-soft">
          Lançamentos registrados em tempo real via agente no WhatsApp.
          Um livro-razão digital, alimentado por IA.
        </p>
      </div>

      <div className="md:col-span-3 md:text-right">
        <div className="eyebrow mb-2 md:text-right">Período em análise</div>
        <FilterBar value={period} onChange={onPeriodChange} />
      </div>
    </header>
  );
}
