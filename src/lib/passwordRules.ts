// Regras de senha forte. Fonte única de verdade — usada tanto pelo
// componente de checklist visual quanto pela validação no submit.

export type PasswordRule = {
  id: string;
  label: string;
  test: (pw: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "Pelo menos 8 caracteres",
    test: (pw) => pw.length >= 8,
  },
  {
    id: "lower",
    label: "Uma letra minúscula (a-z)",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    id: "upper",
    label: "Uma letra maiúscula (A-Z)",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: "number",
    label: "Um número (0-9)",
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    id: "special",
    label: "Um caractere especial (!@#$...)",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

// True se a senha satisfaz todas as regras.
export function isPasswordStrong(pw: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(pw));
}
