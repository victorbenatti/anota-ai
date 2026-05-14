import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Sem credenciais, usamos placeholders pra não quebrar o import do app.
  // As queries vão falhar com erro de rede, mas a UI carrega normal.
  console.warn(
    "[supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ausentes em .env.local — usando placeholder"
  );
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  { auth: { persistSession: false } }
);
