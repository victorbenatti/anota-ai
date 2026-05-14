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

export type Expense = {
  id: string;
  amount: number; // centavos
  description: string;
  category: ExpenseCategory;
  occurred_at: string; // ISO date
  created_at: string; // ISO timestamp
  raw_message: string;
};

export type PeriodPreset = "week" | "month" | "last30" | "custom";

export type PeriodRange = {
  preset: PeriodPreset;
  from: Date;
  to: Date;
};

// Metadados visuais por categoria (cor + rótulo PT-BR).
// As cores são usadas tanto no PieChart quanto no Badge.
// Paleta "tinta" — tons saturados-pra-baixo, sensação de pigmento sobre papel.
export const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string }
> = {
  alimentacao: { label: "Alimentação", color: "#a8321c" }, // tinta vermelha
  transporte:  { label: "Transporte",  color: "#1d3557" }, // azul-marinho
  lazer:       { label: "Lazer",       color: "#6b3e75" }, // ameixa
  mercado:     { label: "Mercado",     color: "#3f6b3a" }, // verde-musgo
  saude:       { label: "Saúde",       color: "#9c2a4e" }, // borgonha
  educacao:    { label: "Educação",    color: "#1f5d6b" }, // petróleo
  casa:        { label: "Casa",        color: "#a35a1c" }, // ocre
  assinaturas: { label: "Assinaturas", color: "#4a3b78" }, // índigo
  vestuario:   { label: "Vestuário",   color: "#2d6b5f" }, // teal escuro
  outros:      { label: "Outros",      color: "#5c5247" }, // grafite quente
};
