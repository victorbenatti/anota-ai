import { useState, type FormEvent } from "react";
import { MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export function WhatsappLinkCard() {
  const { profile, loading, updateWhatsapp } = useProfile();
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // Carregando ou já configurado: não mostra nada
  if (loading || !profile || profile.whatsapp_phone) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSaving(true);
    const { error } = await updateWhatsapp(phone);
    setSaving(false);
    if (error) {
      toast.error("Não foi possível salvar", { description: error });
    } else {
      toast.success("WhatsApp vinculado!", {
        description: "O agente já pode registrar suas despesas.",
      });
    }
  }

  return (
    <div className="reveal mb-6 rounded-xl border border-accent/30 bg-accent-soft p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-ink">
            Conecte seu WhatsApp para começar
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Informe o número que vai conversar com o agente. Sem isso, suas
            mensagens não serão atribuídas à sua conta.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <Input
              type="tel"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="sm:max-w-xs"
            />
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Vincular
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
