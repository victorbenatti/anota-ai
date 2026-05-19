import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { PasswordChecklist } from "@/components/PasswordChecklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { isPasswordStrong } from "@/lib/passwordRules";

export function Signup() {
  const { signUp, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  if (!authLoading && session) {
    return <Navigate to="/app" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong(password)) {
      setError("Sua senha precisa cumprir todos os requisitos abaixo.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(email, password, displayName);
    setSubmitting(false);

    if (signUpError) {
      setError(translateError(signUpError.message));
      return;
    }

    // Se o Supabase exige confirmação de e-mail, não há sessão automática.
    // Mostra mensagem de confirmação; caso contrário, redireciona pro dashboard.
    if (!session) {
      setNeedsConfirm(true);
      return;
    }
    navigate("/app", { replace: true });
  }

  if (needsConfirm) {
    return (
      <AuthLayout title="Quase lá!">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-accent" />
          <p className="text-sm text-ink-soft">
            Enviamos um link de confirmação para{" "}
            <strong className="text-ink">{email}</strong>. Confirme seu e-mail e
            volte aqui para entrar.
          </p>
          <Link
            to="/login"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Ir para o login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Comece a registrar suas despesas em segundos."
      footer={
        <>
          Já tem conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Como prefere ser chamado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha forte"
          />
          <PasswordChecklist password={password} className="pt-1" />
        </div>

        {error && (
          <p className="rounded-lg border border-stamp/20 bg-stamp-soft px-3 py-2 text-sm text-stamp">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={submitting || !isPasswordStrong(password)}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
        </Button>
      </form>
    </AuthLayout>
  );
}

function translateError(msg: string): string {
  if (/already registered/i.test(msg)) return "Este e-mail já está cadastrado.";
  if (/password/i.test(msg)) return "A senha não atende aos requisitos de segurança.";
  return msg;
}
