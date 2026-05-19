import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types/expense";

type WhatsappSettingsCardProps = {
  profile: Profile | null;
  loading: boolean;
  updateWhatsapp: (phone: string) => Promise<{ error: string | null }>;
};

export function WhatsappSettingsCard({
  profile,
  loading,
  updateWhatsapp,
}: WhatsappSettingsCardProps) {
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPhone(profile?.whatsapp_phone ?? "");
  }, [profile?.whatsapp_phone]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Informe o número que conversa com o agente.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await updateWhatsapp(phone);
    setSaving(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    toast.success("WhatsApp atualizado");
  }

  return (
    <SettingsCard
      icon={MessageCircle}
      title="WhatsApp vinculado"
      description="Atualize o número que o agente usa para reconhecer suas despesas."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="whatsapp-phone">Número de WhatsApp</Label>
          <Input
            id="whatsapp-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(11) 98765-4321"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading || saving}
          />
          <p className="text-xs text-ink-muted">
            Salvo em formato internacional para o agente fazer o vínculo reverso.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-stamp/20 bg-stamp-soft px-3 py-2 text-sm text-stamp">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading || saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar WhatsApp"}
        </Button>
      </form>
    </SettingsCard>
  );
}
