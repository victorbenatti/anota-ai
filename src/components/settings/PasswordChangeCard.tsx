import { useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SettingsCard } from "./SettingsCard";
import { PasswordChecklist } from "@/components/PasswordChecklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { isPasswordStrong } from "@/lib/passwordRules";

export function PasswordChangeCard() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong(password)) {
      setError("Sua senha precisa cumprir todos os requisitos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    toast.success("Senha atualizada com sucesso");
    setPassword("");
    setConfirm("");
  }

  const canSubmit = isPasswordStrong(password) && password === confirm;

  return (
    <SettingsCard
      icon={KeyRound}
      title="Trocar senha"
      description="Atualize a senha que você usa pra entrar na sua conta."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova senha</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordChecklist password={password} className="pt-1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar nova senha</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {confirm && confirm !== password && (
            <p className="text-xs text-stamp">As senhas não coincidem.</p>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-stamp/20 bg-stamp/10 px-3 py-2 text-sm text-stamp">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting || !canSubmit}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar senha"}
        </Button>
      </form>
    </SettingsCard>
  );
}
