import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCheck, Sparkles } from "lucide-react";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const LOGO_URL = "/logo-anotaAI.png";

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* --- Coluna esquerda: formulário --- */}
      <div className="relative flex min-h-screen flex-col bg-bg px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="Início">
            <img
              src={LOGO_URL}
              alt="AnotAI"
              className="h-10 w-auto select-none lg:h-12"
              draggable={false}
            />
          </Link>
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
            Voltar pra home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
            )}

            <div className="mt-8">{children}</div>

            {footer && (
              <p className="mt-6 text-sm text-ink-soft">{footer}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-ink-muted">
          © 2026 AnotAI · Projeto de TCC FATEC
        </p>
      </div>

      {/* --- Coluna direita: painel de marca (oculto em mobile) --- */}
      <BrandPanel />
    </div>
  );
}

function BrandPanel() {
  return (
    <aside
      className="relative hidden overflow-hidden bg-brand-strong text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16"
      aria-hidden
    >
      {/* Mesh decorativo lima nos cantos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 100% 0%, hsl(75 60% 45% / 0.25), transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, hsl(75 60% 45% / 0.15), transparent 70%)",
        }}
      />

      {/* Grid de pontos sutil sobre o verde */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(0 0% 100% / 0.7) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Topo: tagline curta */}
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
          Beta aberto · 100% grátis
        </span>
      </div>

      {/* Centro: headline + chat estático preview */}
      <div className="relative space-y-10">
        <h2 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
          Anote pelo WhatsApp.
          <br />
          <span className="text-accent">Visualize tudo aqui.</span>
        </h2>

        <AnimatedChatPreview />
      </div>

      {/* Base: prova de valor + créditos */}
      <div className="relative space-y-3">
        <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
          <Stat label="Categorias" value="10" />
          <Stat label="Tempo p/ começar" value="30s" />
          <Stat label="Custo" value="R$ 0" />
        </div>
        <p className="text-xs text-white/50">
          Construído com Supabase, n8n e Gemini.
        </p>
      </div>
    </aside>
  );
}

// Preview animado do chat. Reusa as keyframes da Hero (loop de 12s) pra
// manter coerência visual com a landing.
function AnimatedChatPreview() {
  return (
    <div className="min-h-[240px] space-y-2.5">
      {/* Bot greeting */}
      <div className="chat-anim-1 max-w-[80%]">
        <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-sm text-ink shadow-lg">
          Oi! Sou o AnotAI 👋 me conta seus gastos.
        </div>
      </div>

      {/* User msg */}
      <div className="chat-anim-2 ml-auto flex max-w-[80%] flex-col items-end">
        <div className="flex items-end gap-1.5 rounded-2xl rounded-br-md bg-[#d9fdd3] px-3.5 py-2 text-sm text-ink shadow-lg">
          <span>gastei 30 na padaria</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1 pr-2">
          <span className="num text-[9px] text-white/50">14:02</span>
          <CheckCheck className="h-3 w-3 text-[#53bdeb]" strokeWidth={2.5} />
        </div>
      </div>

      {/* Typing indicator */}
      <div className="chat-typing-anim-1 flex max-w-[60px]">
        <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2.5 shadow-lg">
          <span className="typing-dot-anim h-1.5 w-1.5 rounded-full bg-ink-muted" />
          <span className="typing-dot-anim h-1.5 w-1.5 rounded-full bg-ink-muted" />
          <span className="typing-dot-anim h-1.5 w-1.5 rounded-full bg-ink-muted" />
        </div>
      </div>

      {/* Bot confirm */}
      <div className="chat-anim-3 max-w-[80%]">
        <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-sm text-ink shadow-lg">
          ✅ R$ 30,00 em <strong className="font-semibold">alimentação</strong> registrado.
        </div>
        <span className="num mt-0.5 inline-block pl-2 text-[9px] text-white/50">14:02</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="num text-2xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/50">
        {label}
      </div>
    </div>
  );
}
