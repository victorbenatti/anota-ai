import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { endOfWeek, startOfWeek } from "date-fns";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryChart } from "@/components/CategoryChart";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { ExpensesList } from "@/components/ExpensesList";
import { useExpenses } from "@/hooks/useExpenses";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { PeriodRange } from "@/types/expense";

function buildWeeklyRange(): PeriodRange {
  const now = new Date();
  return {
    preset: "week",
    from: startOfWeek(now, { weekStartsOn: 1 }),
    to: endOfWeek(now, { weekStartsOn: 1 }),
  };
}

export function Dashboard() {
  const range = useMemo(() => buildWeeklyRange(), []);

  const { expenses, loading, error, refetch } = useExpenses(range);

  const handleInsert = useCallback(() => {
    toast("Nova despesa registrada", {
      description: "Atualização em tempo real via WhatsApp.",
    });
    void refetch();
  }, [refetch]);

  useSupabaseRealtime(handleInsert);

  const isEmpty = !loading && !error && expenses.length === 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent calc(2.5rem - 1px), hsl(var(--rule) / 0.45) calc(2.5rem), transparent calc(2.5rem + 1px)), linear-gradient(to left, transparent calc(2.5rem - 1px), hsl(var(--rule) / 0.45) calc(2.5rem), transparent calc(2.5rem + 1px))",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-5 pb-24 pt-7 md:px-12 lg:px-16">
        <Masthead />

        <DashboardHeader range={range} />

        {!isSupabaseConfigured && (
          <div className="mb-8 border-l-2 border-stamp bg-stamp-soft/70 px-4 py-3 font-display text-sm text-ink shadow-[3px_3px_0_hsl(var(--ink))]">
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
            Não foi possível carregar os dados: {error}
          </div>
        )}

        {isEmpty ? (
          <EmptyState />
        ) : (
          <main className="space-y-14">
            <section>
              <SectionLabel number="I" title="Leitura rápida" />
              <div className="mt-6">
                <SummaryCards
                  expenses={expenses}
                  range={range}
                  loading={loading}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <WeeklyTrendChart expenses={expenses} range={range} loading={loading} />
              <CategoryChart expenses={expenses} loading={loading} />
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
    <div className="mb-8 flex flex-col gap-4 border-b border-ink pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="brand-mark" aria-hidden />
        <div>
          <div
            className="font-display text-2xl leading-none text-ink"
            style={{ fontVariationSettings: '"opsz" 72, "wght" 700' }}
          >
            ANOTA AI
          </div>
          <div className="eyebrow mt-1">Gestão financeira</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <span className="eyebrow">v 0.1 / TCC FATEC</span>
        <span className="inline-flex items-center gap-2 border border-rule bg-ledger-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ledger">
          <span
            aria-hidden
            className="h-2 w-2 animate-pulse rounded-full bg-ledger"
          />
          Online
        </span>
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
        style={{ fontVariationSettings: '"opsz" 72, "wght" 460' }}
      >
        Nada anotado nesta semana.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-soft">
        Assim que uma despesa entrar no Supabase, o painel assume a leitura do
        período automaticamente.
      </p>
    </div>
  );
}

function Colophon() {
  return (
    <footer className="mt-24 border-t border-ink pt-4">
      <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.14em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono">Fonte: Supabase / expenses</span>
        <span className="font-display italic">
          Composto em Newsreader, Manrope e IBM Plex Mono
        </span>
      </div>
    </footer>
  );
}
