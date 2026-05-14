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
// Paleta com tintas institucionais: caixa, confiança, carimbo e metais contábeis.
export const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string }
> = {
  alimentacao: { label: "Alimentação", color: "#9f3a26" },
  transporte: { label: "Transporte", color: "#26547c" },
  lazer: { label: "Lazer", color: "#6b4778" },
  mercado: { label: "Mercado", color: "#2f6b4f" },
  saude: { label: "Saúde", color: "#9a3155" },
  educacao: { label: "Educação", color: "#1f6675" },
  casa: { label: "Casa", color: "#9a6424" },
  assinaturas: { label: "Assinaturas", color: "#4d4a86" },
  vestuario: { label: "Vestuário", color: "#2d6f68" },
  outros: { label: "Outros", color: "#5c5b51" },
};
