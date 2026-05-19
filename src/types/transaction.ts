import {
  Award,
  Briefcase,
  Car,
  CreditCard,
  Gift,
  GraduationCap,
  Heart,
  Home,
  type LucideIcon,
  Package,
  PartyPopper,
  Plus,
  Shirt,
  ShoppingBasket,
  Sparkles,
  TrendingUp,
  Undo2,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

export type TransactionType = "expense" | "income";

export type ExpenseCategory =
  | "alimentacao"
  | "transporte"
  | "lazer"
  | "mercado"
  | "saude"
  | "educacao"
  | "casa"
  | "assinaturas"
  | "vestuario"
  | "outros";

export type IncomeCategory =
  | "salario"
  | "pj"
  | "renda_extra"
  | "comissao"
  | "investimentos"
  | "reembolso"
  | "presente"
  | "outros_receita";

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export type Transaction = {
  id: string;
  user_id: string;
  amount: number; // centavos, sempre positivo
  description: string;
  category: TransactionCategory;
  transaction_type: TransactionType;
  occurred_at: string; // ISO date
  created_at: string; // ISO timestamp
  raw_message: string;
  whatsapp_number?: string | null;
};

export type Profile = {
  id: string;
  display_name: string | null;
  whatsapp_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type PeriodPreset = "week" | "month" | "last30";

export const PERIOD_LABELS: Record<PeriodPreset, string> = {
  week: "Esta semana",
  month: "Este mês",
  last30: "Últimos 30 dias",
};

export type PeriodRange = {
  preset: PeriodPreset;
  from: Date;
  to: Date;
};

/**
 * Metadados visuais de cada categoria — rótulo, cor e ícone.
 * Fonte única de verdade. Quem precisa renderizar uma categoria importa daqui.
 */
export type CategoryMeta = {
  label: string;
  color: string;
  icon: LucideIcon;
};

export const EXPENSE_CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  alimentacao: { label: "Alimentação", color: "#a8472f", icon: UtensilsCrossed },
  transporte:  { label: "Transporte",  color: "#2b5d52", icon: Car },
  lazer:       { label: "Lazer",       color: "#6e4a63", icon: PartyPopper },
  mercado:     { label: "Mercado",     color: "#6f7e2e", icon: ShoppingBasket },
  saude:       { label: "Saúde",       color: "#8f3a44", icon: Heart },
  educacao:    { label: "Educação",    color: "#1f5f63", icon: GraduationCap },
  casa:        { label: "Casa",        color: "#9a6b2f", icon: Home },
  assinaturas: { label: "Assinaturas", color: "#44574f", icon: CreditCard },
  vestuario:   { label: "Vestuário",   color: "#3a7a6b", icon: Shirt },
  outros:      { label: "Outros",      color: "#6b6357", icon: Package },
};

export const INCOME_CATEGORY_META: Record<IncomeCategory, CategoryMeta> = {
  salario:        { label: "Salário",         color: "#2b5d52", icon: Wallet },
  pj:             { label: "PJ",              color: "#1f5f63", icon: Briefcase },
  renda_extra:    { label: "Renda extra",     color: "#3a7a6b", icon: Plus },
  comissao:       { label: "Comissão",        color: "#6f7e2e", icon: Award },
  investimentos:  { label: "Investimentos",   color: "#44574f", icon: TrendingUp },
  reembolso:      { label: "Reembolso",       color: "#9a6b2f", icon: Undo2 },
  presente:       { label: "Presente",        color: "#6e4a63", icon: Gift },
  outros_receita: { label: "Outras receitas", color: "#6b6357", icon: Sparkles },
};

export const CATEGORY_META: Record<TransactionCategory, CategoryMeta> = {
  ...EXPENSE_CATEGORY_META,
  ...INCOME_CATEGORY_META,
};

export function isExpenseCategory(
  category: TransactionCategory
): category is ExpenseCategory {
  return category in EXPENSE_CATEGORY_META;
}

export function isIncomeCategory(
  category: TransactionCategory
): category is IncomeCategory {
  return category in INCOME_CATEGORY_META;
}
