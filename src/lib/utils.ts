import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata centavos como moeda BRL: 3250 -> "R$ 32,50"
export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

/**
 * Convenção de cores monetárias do dashboard.
 *  - "income"          → receitas (sempre verde/accent)
 *  - "expense"         → despesas (sempre vermelho/stamp)
 *  - "balance"         → saldo: verde se >=0, vermelho se <0
 *  - "neutral"         → texto padrão
 *
 * Centralizado aqui pra evitar inconsistência entre componentes.
 */
export type AmountTone = "income" | "expense" | "balance" | "neutral";

export function amountToneClass(tone: AmountTone, value = 0): string {
  switch (tone) {
    case "income":
      return "text-accent";
    case "expense":
      return "text-stamp";
    case "balance":
      return value < 0 ? "text-stamp" : "text-accent";
    case "neutral":
      return "text-ink";
  }
}
