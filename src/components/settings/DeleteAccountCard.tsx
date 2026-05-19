import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export function DeleteAccountCard() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expected = user?.email ?? "EXCLUIR";
  const canDelete = confirmation.trim() === expected;

  async function handleDelete() {
    if (!canDelete || deleting) return;

    setError(null);
    setDeleting(true);
    const { error: deleteError } = await deleteAccount();
    setDeleting(false);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    toast.success("Conta deletada");
    navigate("/", { replace: true });
  }

  return (
    <SettingsCard
      icon={Trash2}
      title="Deletar conta"
      description="Remova sua conta e os dados vinculados a ela. Esta ação não pode ser desfeita."
      destructive
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-stamp/20 bg-stamp-soft px-3 py-2.5 text-sm text-stamp">
          Ao confirmar, sua conta de autenticação será removida e as linhas de
          profile/despesas serão apagadas em cascata pelo banco.
        </div>

        <div className="space-y-2">
          <Label htmlFor="delete-confirmation">
            Digite seu e-mail para confirmar
          </Label>
          <Input
            id="delete-confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={expected}
            disabled={deleting}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-stamp/20 bg-stamp-soft px-3 py-2 text-sm text-stamp">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="destructive"
          disabled={!canDelete || deleting}
          onClick={handleDelete}
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deletar minha conta"}
        </Button>
      </div>
    </SettingsCard>
  );
}
