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

export type PeriodPreset = "week";

export type PeriodRange = {
  preset: PeriodPreset;
  from: Date;
  to: Date;
};

// Fonte única de rótulos e cores de categoria.
// Paleta editorial harmonizada com o verde-petróleo da marca:
// tons terrosos e dessaturados que assentam sobre o papel creme,
// sem cair na "paleta arco-íris" que o BRAND.md pede para evitar.
export const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string }
> = {
  alimentacao: { label: "Alimentação", color: "#a8472f" }, // terracota
  transporte:  { label: "Transporte",  color: "#2b5d52" }, // petróleo médio
  lazer:       { label: "Lazer",       color: "#6e4a63" }, // ameixa fosca
  mercado:     { label: "Mercado",     color: "#6f7e2e" }, // oliva
  saude:       { label: "Saúde",       color: "#8f3a44" }, // borgonha
  educacao:    { label: "Educação",    color: "#1f5f63" }, // verde-azulado
  casa:        { label: "Casa",        color: "#9a6b2f" }, // ocre
  assinaturas: { label: "Assinaturas", color: "#44574f" }, // verde-grafite
  vestuario:   { label: "Vestuário",   color: "#3a7a6b" }, // teal fosco
  outros:      { label: "Outros",      color: "#6b6357" }, // cinza quente
};
