import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type { Profile } from "@/types/expense";

type UseProfileResult = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateWhatsapp: (phone: string) => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
};

// Carrega o profile do usuário logado. RLS garante que ele só vê o próprio.
export function useProfile(): UseProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (queryError) {
      setError(queryError.message);
      setProfile(null);
    } else {
      setProfile(data as Profile | null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const updateWhatsapp = useCallback<UseProfileResult["updateWhatsapp"]>(
    async (phone) => {
      if (!user) return { error: "Não autenticado." };

      const normalized = phone.replace(/\D/g, "");
      const localNumber = normalized.startsWith("55") && normalized.length > 11
        ? normalized.slice(2)
        : normalized;

      if (localNumber.length < 10 || localNumber.length > 11) {
        return { error: "Informe um WhatsApp brasileiro com DDD." };
      }

      const e164 = `+55${localNumber}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ whatsapp_phone: e164 })
        .eq("id", user.id);

      if (updateError) return { error: updateError.message };
      await fetchProfile();
      return { error: null };
    },
    [user, fetchProfile]
  );

  return { profile, loading, error, updateWhatsapp, refetch: fetchProfile };
}
