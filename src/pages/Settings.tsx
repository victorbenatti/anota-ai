import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { PasswordChangeCard } from "@/components/settings/PasswordChangeCard";
import { WhatsappSettingsCard } from "@/components/settings/WhatsappSettingsCard";
import { PersonalDataCard } from "@/components/settings/PersonalDataCard";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const LOGO_URL = "/logo-anotaAI.png";

export function Settings() {
  const { signOut, user } = useAuth();
  const { profile, loading, error, updateWhatsapp } = useProfile();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate("/login", { replace: true });
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <Link to="/app" aria-label="Voltar para o dashboard">
            <img
              src={LOGO_URL}
              alt="AnotAI"
              className="h-9 w-auto select-none md:h-11"
              draggable={false}
            />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/app">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8">
        <header className="mb-8">
          <span className="eyebrow">Conta e privacidade</span>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">
                Configurações
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
                Gerencie acesso, WhatsApp vinculado e os dados pessoais que o
                AnotAI guarda para alimentar o dashboard.
              </p>
            </div>
            {user?.email && (
              <span className="num text-xs text-ink-muted">{user.email}</span>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-stamp/20 bg-stamp-soft px-4 py-3.5 text-sm text-stamp">
            Não foi possível carregar seu perfil: {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <PasswordChangeCard />
          <WhatsappSettingsCard
            profile={profile}
            loading={loading}
            updateWhatsapp={updateWhatsapp}
          />
          <PersonalDataCard user={user} profile={profile} />
          <DeleteAccountCard />
        </div>
      </main>
    </div>
  );
}
