import { useMemo } from "react";
import { Download, FileText, Loader2, RefreshCcw } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { usePersonalData } from "@/hooks/usePersonalData";
import type { Profile, Transaction } from "@/types/transaction";

type PersonalDataCardProps = {
  user: User | null;
  profile: Profile | null;
};

export function PersonalDataCard({ user, profile }: PersonalDataCardProps) {
  const { transactions, loading, error, refetch } = usePersonalData();
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const exportPayload = useMemo(
    () => (user ? buildExportPayload(user, profile, transactions) : null),
    [user, profile, transactions]
  );

  function downloadJson() {
    if (!exportPayload) return;

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `anota-ai-dados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SettingsCard
      icon={FileText}
      title="Dados pessoais"
      description="Veja os dados da sua conta e exporte uma cópia em JSON."
    >
      <div className="space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <DataPoint label="E-mail" value={user?.email ?? "Não informado"} />
          <DataPoint label="Nome" value={profile?.display_name ?? "Não informado"} />
          <DataPoint label="WhatsApp" value={profile?.whatsapp_phone ?? "Não vinculado"} />
          <DataPoint
            label="Criação da conta"
            value={user?.created_at ? formatDate(user.created_at) : "Não informado"}
          />
          <DataPoint
            label="Lançamentos registrados"
            value={String(transactions.length)}
          />
          <DataPoint
            label="Receitas históricas"
            value={formatCurrency(totals.income)}
            strong
          />
          <DataPoint
            label="Despesas históricas"
            value={formatCurrency(totals.expense)}
            strong
          />
          <DataPoint
            label="Saldo histórico"
            value={formatCurrency(totals.balance)}
            strong
          />
        </dl>

        {error && (
          <p className="rounded-lg border border-stamp/20 bg-stamp-soft px-3 py-2 text-sm text-stamp">
            Não foi possível carregar seus lançamentos: {error}
          </p>
        )}

        {exportPayload && (
          <details className="rounded-lg border border-line bg-surface-muted px-3 py-2.5 text-sm">
            <summary className="cursor-pointer font-medium text-ink">
              Ver dados exportáveis
            </summary>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-surface p-3 text-xs leading-5 text-ink-soft">
              {JSON.stringify(exportPayload, null, 2)}
            </pre>
          </details>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={downloadJson} disabled={loading || !user}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar resumo
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
}

function DataPoint({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
      <dt className="eyebrow">{label}</dt>
      <dd
        className={
          strong
            ? "num mt-1 text-sm font-semibold text-stamp"
            : "mt-1 break-words text-sm text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function buildExportPayload(
  user: User,
  profile: Profile | null,
  transactions: Transaction[]
) {
  const totals = calculateTotals(transactions);
  return {
    schema: "anota-ai-personal-data-v2",
    exported_at: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile,
    totals,
    transactions,
  };
}

function calculateTotals(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;
  for (const transaction of transactions) {
    if (transaction.transaction_type === "income") income += transaction.amount;
    else expense += transaction.amount;
  }
  return {
    income,
    expense,
    balance: income - expense,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
