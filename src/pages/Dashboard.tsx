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

// Logo oficial servida estaticamente de public/
const LOGO_URL = "/logo-anotaAI.png";

// O painel opera em visão semanal fixa (segunda a domingo).
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
    <div className="min-h-screen">
      {/* Barra de topo */}
      <nav className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <img
            src={LOGO_URL}
            alt="AnotAI"
            className="h-9 w-auto select-none md:h-11"
            draggable={false}
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Agente online
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8">
        <DashboardHeader range={range} />

        {!isSupabaseConfigured && (
          <div className="reveal mb-8 flex gap-3 rounded-xl border border-stamp/20 bg-stamp-soft px-4 py-3.5 text-sm text-ink">
            <span className="mt-0.5 font-semibold text-stamp">Configuração pendente</span>
            <p className="text-ink-soft">
              Preencha <code className="rounded bg-surface px-1 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> e{" "}
              <code className="rounded bg-surface px-1 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> em{" "}
              <code className="rounded bg-surface px-1 py-0.5 font-mono text-xs">.env.local</code> e reinicie o servidor.
            </p>
          </div>
        )}

        {error && (
          <div className="reveal mb-8 rounded-xl border border-stamp/20 bg-stamp-soft px-4 py-3.5 text-sm text-stamp">
            Não foi possível carregar os dados: {error}
          </div>
        )}

        {isEmpty ? (
          <EmptyState />
        ) : (
          <main className="space-y-8">
            <section className="reveal" style={{ animationDelay: "60ms" }}>
              <SummaryCards expenses={expenses} range={range} loading={loading} />
            </section>

            <section
              className="reveal grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
              style={{ animationDelay: "120ms" }}
            >
              <WeeklyTrendChart expenses={expenses} range={range} loading={loading} />
              <CategoryChart expenses={expenses} loading={loading} />
            </section>

            <section className="reveal" style={{ animationDelay: "180ms" }}>
              <ExpensesList expenses={expenses} loading={loading} />
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="reveal mt-6 flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <span className="text-xl">✦</span>
      </div>
      <h2 className="mt-5 text-xl font-semibold text-ink">
        Nada anotado nesta semana
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
        Assim que uma despesa entrar no Supabase, o painel assume a leitura do
        período automaticamente.
      </p>
    </div>
  );
}
