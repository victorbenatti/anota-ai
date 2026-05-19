import { Check } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/passwordRules";
import { cn } from "@/lib/utils";

type PasswordChecklistProps = {
  password: string;
  className?: string;
};

// Checklist visual das regras de senha. Cada item troca pra verde-lima
// quando a regra correspondente está satisfeita.
export function PasswordChecklist({ password, className }: PasswordChecklistProps) {
  return (
    <ul
      className={cn("grid gap-1.5 sm:grid-cols-2", className)}
      aria-label="Requisitos da senha"
    >
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <li
            key={rule.id}
            className="flex items-center gap-2 text-xs leading-tight transition-colors"
          >
            <span
              aria-hidden
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                ok
                  ? "scale-100 border-accent bg-accent text-ink"
                  : "scale-95 border-line bg-surface text-transparent"
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span
              className={cn(
                "transition-colors",
                ok
                  ? "font-medium text-ink"
                  : "text-ink-muted"
              )}
            >
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
