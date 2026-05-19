import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
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
import { TransactionsList } from "@/components/ExpensesList";
import { WhatsappLinkCard } from "@/components/WhatsappLinkCard";
import { MonthComparisonCard } from "@/components/MonthComparisonCard";
import { InsightsCard } from "@/components/InsightsCard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTransactions } from "@/hooks/useTransactions";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { isSupabaseConfigured } from "@/lib/supabase";
import type {
  PeriodPreset,
  PeriodRange,
  Transaction,
} from "@/types/transaction";

const LOGO_URL = "/logo-anotaAI.png";

// Constrói o range concreto a partir do preset selecionado.
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
      return { preset, from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
  }
}

export function Dashboard() {
  const [period, setPeriod] = useState<PeriodPreset>("month");
  const [comparisonRefreshKey, setComparisonRefreshKey] = useState(0);
  const range = useMemo(() => buildRange(period), [period]);
  const { transactions, loading, error, refetch } = useTransactions(range);
  const { profile } = useProfile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleInsert = useCallback((transaction: Transaction) => {
    const isIncome = transaction.transaction_type === "income";
    toast(isIncome ? "Nova receita registrada" : "Nova despesa registrada", {
      description: "Atualização em tempo real via WhatsApp.",
    });
    setComparisonRefreshKey((key) => key + 1);
    void refetch();
  }, [refetch]);

  useSupabaseRealtime(handleInsert);

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate("/login", { replace: true });
  }, [signOut, navigate]);

  const isEmpty = !loading && !error && transactions.length === 0;

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <img
            src={LOGO_URL}
            alt="AnotAI"
            className="h-9 w-auto select-none md:h-11"
            draggable={false}
          />

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft sm:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Agente online
            </span>

            {user && (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-ink-muted md:inline">
                  {user.email}
                </span>
                <ThemeToggle />
                <Button asChild variant="ghost" size="icon" aria-label="Configurações" title="Configurações">
                  <Link to="/app/settings">
                    <SettingsIcon className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  aria-label="Sair"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8">
        <DashboardHeader
          range={range}
          period={period}
          onPeriodChange={setPeriod}
          displayName={profile?.display_name}
        />

        <WhatsappLinkCard />

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

        <main className="space-y-8">
          <section className="reveal" style={{ animationDelay: "40ms" }}>
            <MonthComparisonCard refreshKey={comparisonRefreshKey} />
          </section>

          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <section className="reveal" style={{ animationDelay: "80ms" }}>
                <SummaryCards
                  transactions={transactions}
                  range={range}
                  loading={loading}
                />
              </section>

              <section className="reveal" style={{ animationDelay: "100ms" }}>
                <InsightsCard
                  transactions={transactions}
                  range={range}
                  loading={loading}
                />
              </section>

              <section
                className="reveal grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
                style={{ animationDelay: "120ms" }}
              >
                <WeeklyTrendChart
                  transactions={transactions}
                  range={range}
                  loading={loading}
                  period={period}
                  onPeriodChange={setPeriod}
                />
                <CategoryChart transactions={transactions} loading={loading} />
              </section>

              <section className="reveal" style={{ animationDelay: "180ms" }}>
                <TransactionsList
                  transactions={transactions}
                  loading={loading}
                />
              </section>
            </>
          )}
        </main>
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
        Nada anotado neste período
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
        Assim que uma receita ou despesa entrar no Supabase, o painel assume a
        leitura do período automaticamente.
      </p>
    </div>
  );
}
