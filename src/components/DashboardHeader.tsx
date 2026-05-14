import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Landmark, ShieldCheck, TrendingUp, Wifi } from "lucide-react";
import { FilterBar } from "./FilterBar";
import type { PeriodRange } from "@/types/expense";

type DashboardHeaderProps = {
  range: PeriodRange;
};

export function DashboardHeader({ range }: DashboardHeaderProps) {
  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const weekRange = `${format(range.from, "dd", { locale: ptBR })} a ${format(
    range.to,
    "dd/MM",
    { locale: ptBR }
  )}`;

  return (
    <header className="ledger-panel mb-8 grid grid-cols-1 gap-8 pb-8 pt-7 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="status-chip">
            <Landmark className="h-3.5 w-3.5 text-ledger" />
            Gestão pessoal
          </span>
          <span className="status-chip">
            <TrendingUp className="h-3.5 w-3.5 text-brass" />
            Visão semanal
          </span>
          <span className="status-chip">
            <Wifi className="h-3.5 w-3.5 text-stamp" />
            Realtime
          </span>
          <span className="status-chip">
            <ShieldCheck className="h-3.5 w-3.5 text-trust" />
            Supabase
          </span>
        </div>

        <h1
          className="display mt-5 max-w-4xl text-5xl font-semibold text-ink md:text-6xl xl:text-7xl"
          style={{ fontVariationSettings: '"opsz" 72, "wght" 560' }}
        >
          Painel financeiro{" "}
          <em
            className="font-medium italic text-ledger"
            style={{ fontVariationSettings: '"opsz" 72, "wght" 520' }}
          >
            semanal
          </em>
        </h1>

        <p className="mt-4 max-w-2xl font-sans text-base leading-7 text-ink-soft">
          Resumo intuitivo dos gastos da semana, com foco no que mudou, onde o
          dinheiro se concentrou e quais registros merecem atenção.
        </p>
      </div>

      <div className="md:col-span-5">
        <div className="grid gap-3 sm:grid-cols-2 md:ml-auto md:max-w-lg">
          <div className="border border-rule bg-paper/80 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brass" />
              <span className="eyebrow">Hoje</span>
            </div>
            <p className="font-sans text-sm font-semibold text-ink">{today}</p>
          </div>
          <div className="border border-rule bg-ledger-soft/70 p-4">
            <div className="eyebrow mb-3">Período em análise</div>
            <FilterBar rangeLabel={weekRange} />
          </div>
        </div>
      </div>
    </header>
  );
}
