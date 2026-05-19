import { Link } from "react-router-dom";
import { ArrowRight, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// CTA de fechamento. Composição editorial: headline massivo + bolhas de chat
// flutuando como elementos gráficos (estáticas, sem animação — o destaque
// motion já está na hero).
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-strong py-24 text-white md:py-32">
      {/* Mesh radial decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, hsl(75 60% 45% / 0.18), transparent 60%), radial-gradient(ellipse 50% 50% at 50% 100%, hsl(170 50% 25% / 0.6), transparent 70%)",
        }}
      />

      {/* Grid de pontos sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(0 0% 100% / 0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Bolhas flutuantes — posicionamento absoluto, escondidas em mobile */}
      <FloatingBubbleLeft />
      <FloatingBubbleRight />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Ainda dá pra entrar no beta
        </span>

        <h2 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          É só mandar
          <br />
          uma <span className="text-accent">mensagem</span>.
        </h2>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
          Crie sua conta, vincule o WhatsApp e comece a conversar. O resto, o
          AnotAI cuida em tempo real.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            asChild
            size="lg"
            className="group h-14 bg-accent px-8 text-base font-bold text-ink shadow-[0_8px_30px_-8px_rgb(159_190_39/0.6)] transition-all hover:bg-accent/90 hover:shadow-[0_12px_40px_-8px_rgb(159_190_39/0.8)]"
          >
            <Link to="/signup">
              Começar grátis agora
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <p className="num text-[11px] uppercase tracking-wider text-white/50">
            sem cartão · sem trial · sem propaganda
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- Bolhas decorativas flutuantes ----------

function FloatingBubbleLeft() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-[6%] top-[22%] hidden max-w-[220px] -rotate-6 lg:block"
    >
      <div className="rounded-2xl rounded-br-md bg-[#d9fdd3] px-3.5 py-2 text-sm text-[#19342f] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
        gastei 30 na padaria
      </div>
      <div className="mt-1 flex items-center justify-end gap-1 pr-2">
        <span className="num text-[9px] text-white/50">14:02</span>
        <CheckCheck className="h-3 w-3 text-[#53bdeb]" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function FloatingBubbleRight() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[6%] top-[62%] hidden max-w-[240px] rotate-3 lg:block"
    >
      <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-sm text-[#19342f] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
        ✅ R$ 30,00 em <strong className="font-semibold">alimentação</strong> registrado.
      </div>
      <span className="num mt-1 inline-block pl-2 text-[9px] text-white/50">
        14:02
      </span>
    </div>
  );
}
