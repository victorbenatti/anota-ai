import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SettingsCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  destructive?: boolean;
};

// Casca padrão dos cards da página de settings — header com ícone + título +
// descrição curta, e slot pra conteúdo interno (form, botão, etc.).
export function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
  destructive,
}: SettingsCardProps) {
  return (
    <section
      className={`card-soft p-6 ${
        destructive ? "border-stamp/40" : ""
      }`}
    >
      <header className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            destructive
              ? "bg-stamp/10 text-stamp"
              : "bg-surface-muted text-brand"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
        </div>
      </header>

      <div className="mt-5">{children}</div>
    </section>
  );
}
