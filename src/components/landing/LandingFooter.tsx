import { Link } from "react-router-dom";

const LOGO_URL = "/logo-anotaAI.png";

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface py-12">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <img
              src={LOGO_URL}
              alt="AnotAI"
              className="h-10 w-auto select-none"
              draggable={false}
            />
            <p className="mt-3 text-sm text-ink-soft">
              Seu assistente financeiro no WhatsApp.
            </p>
          </div>

          <nav
            aria-label="Rodapé"
            className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm"
          >
            <div className="col-span-2 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Produto
            </div>
            <a href="/#como-funciona" className="text-ink-soft hover:text-ink">
              Como funciona
            </a>
            <a href="/#features" className="text-ink-soft hover:text-ink">
              Features
            </a>
            <Link to="/sobre" className="text-ink-soft hover:text-ink">
              Sobre nós
            </Link>
            <a href="/#faq" className="text-ink-soft hover:text-ink">
              FAQ
            </a>
            <Link to="/login" className="text-ink-soft hover:text-ink">
              Entrar
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            Projeto de TCC FATEC ·{" "}
            <span className="font-semibold text-ink-soft">Victor Benatti</span> · 2026
          </span>
          <span className="font-mono">
            Construído com React, Supabase, n8n e Gemini
          </span>
        </div>
      </div>
    </footer>
  );
}
