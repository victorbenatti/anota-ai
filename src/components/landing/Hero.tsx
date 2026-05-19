import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappChatMockup } from "./WhatsappChatMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Mesh decorativo: gradient radial verde-petróleo no canto sup. esq. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 0%, hsl(170 46% 20% / 0.10), transparent 60%), radial-gradient(ellipse 40% 30% at 90% 30%, hsl(75 60% 45% / 0.08), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28">
        {/* Coluna esquerda — copy */}
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink-soft shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
            Beta aberto · 100% grátis
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-6xl">
            Anotar gastos não devia
            <br />
            exigir um{" "}
            <span className="relative inline-block">
              <span className="relative z-10">app.</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent/40 md:h-4"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            AnotAI é o assistente financeiro pessoal que vive no seu WhatsApp.
            Mande uma mensagem, ele registra. Pergunte{" "}
            <em className="font-mono not-italic text-ink">"quanto gastei?"</em>,
            ele responde.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-soft-md group">
              <Link to="/signup">
                Começar grátis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#como-funciona">Ver como funciona</a>
            </Button>
          </div>

          {/* Mini "social proof" textual */}
          <div className="mt-10 flex items-center gap-4 text-xs text-ink-muted">
            <div className="flex -space-x-1.5">
              {["#1d3557", "#a8472f", "#6f7e2e"].map((c) => (
                <span
                  key={c}
                  className="h-6 w-6 rounded-full border-2 border-bg"
                  style={{ backgroundColor: c }}
                  aria-hidden
                />
              ))}
            </div>
            <span>
              Construído com Supabase, n8n e Gemini · open source ready
            </span>
          </div>
        </div>

        {/* Coluna direita — mockup animado */}
        <div className="reveal" style={{ animationDelay: "120ms" }}>
          <WhatsappChatMockup />
        </div>
      </div>
    </section>
  );
}
