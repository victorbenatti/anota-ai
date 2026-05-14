import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryChart } from "@/components/CategoryChart";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { ExpensesList } from "@/components/ExpensesList";
import { useExpenses } from "@/hooks/useExpenses";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { PeriodPreset, PeriodRange } from "@/types/expense";

function buildRange(preset: PeriodPreset): PeriodRange {
  const now = new Date();
  switch (preset) {
    case "week":
      return {
        preset,
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "month":
      return { preset, from: startOfMonth(now), to: endOfMonth(now) };
    case "last30":
    case "custom":
      return { preset, from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
  }
}

export function Dashboard() {
  const [period, setPeriod] = useState<PeriodPreset>("month");
  const range = useMemo(() => buildRange(period), [period]);

  const { expenses, loading, error, refetch } = useExpenses(range);

  const handleInsert = useCallback(() => {
    toast("Nova despesa registrada", {
      description: "atualização em tempo real via WhatsApp",
    });
    void refetch();
  }, [refetch]);

  useSupabaseRealtime(handleInsert);

  const isEmpty = !loading && !error && expenses.length === 0;

  return (
    <div className="relative min-h-screen">
      {/* margem editorial: linhas verticais sutis nas laterais em telas grandes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent calc(2.5rem - 1px), hsl(var(--rule) / 0.5) calc(2.5rem), transparent calc(2.5rem + 1px)), linear-gradient(to left, transparent calc(2.5rem - 1px), hsl(var(--rule) / 0.5) calc(2.5rem), transparent calc(2.5rem + 1px))",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pb-24 pt-10 md:px-16">
        {/* Cabeçalho da "publicação" */}
        <Masthead />

        <DashboardHeader period={period} onPeriodChange={setPeriod} />

        {!isSupabaseConfigured && (
          <div className="mb-8 border-l-2 border-stamp bg-stamp-soft/60 px-4 py-3 font-display text-sm text-ink">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stamp">
              Aviso da redação
            </span>
            <p className="mt-1">
              Preencha <code className="font-mono">VITE_SUPABASE_URL</code> e{" "}
              <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> em{" "}
              <code className="font-mono">.env.local</code> e reinicie o servidor.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-8 border-l-2 border-stamp px-4 py-3 font-display italic text-stamp">
            Não foi possível carregar os dados — {error}
          </div>
        )}

        {isEmpty ? (
          <EmptyState />
        ) : (
          <main className="space-y-14">
            <section>
              <SectionLabel number="I" title="Sumário do período" />
              <div className="mt-6">
                <SummaryCards
                  expenses={expenses}
                  range={range}
                  loading={loading}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <CategoryChart expenses={expenses} loading={loading} />
              <WeeklyTrendChart expenses={expenses} loading={loading} />
            </section>

            <section>
              <ExpensesList expenses={expenses} loading={loading} />
            </section>
          </main>
        )}

        <Colophon />
      </div>
    </div>
  );
}

function Masthead() {
  return (
    <div className="mb-12 flex items-center justify-between border-b border-ink pb-3">
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-2xl"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 600' }}
        >
          ANOTA·AI
        </span>
        <span className="eyebrow">Diário de gastos</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="eyebrow hidden sm:inline">v 0.1 — TCC FATEC</span>
        <span
          aria-hidden
          className="inline-flex h-2 w-2 animate-pulse rounded-full bg-stamp"
          title="Realtime ativo"
        />
      </div>
    </div>
  );
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-ink pt-4">
      <span className="num text-xs text-ink-soft">{number}</span>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 border-y border-ink py-24 text-center">
      <p className="eyebrow">Edição em branco</p>
      <p
        className="mt-4 font-display text-4xl italic text-ink"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
      >
        Nada anotado ainda.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
        Mande uma mensagem no WhatsApp — assim que o agente registrar, o livro-razão
        abre nesta página em tempo real.
      </p>
    </div>
  );
}

function Colophon() {
  return (
    <footer className="mt-24 border-t border-ink pt-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        <span className="font-mono">Fonte: Supabase · expenses</span>
        <span className="font-display italic">
          Composto em Fraunces & IBM Plex Mono
        </span>
      </div>
    </footer>
  );
}
