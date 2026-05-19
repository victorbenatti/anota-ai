import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="bg-bg py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-brand px-8 py-16 text-center md:px-16 md:py-20">
          {/* Mesh decorativo lima */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 50% 80% at 100% 0%, hsl(75 60% 45% / 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, hsl(75 60% 45% / 0.20), transparent 70%)",
            }}
          />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Pronto para anotar sem app?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-white/80">
              Em 30 segundos você está vinculado ao WhatsApp e mandando a
              primeira despesa.
            </p>

            <Button
              asChild
              size="lg"
              className="group mt-8 bg-accent text-ink hover:bg-accent/90"
            >
              <Link to="/signup">
                Começar grátis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <p className="mt-4 text-xs text-white/60">
              Sem cartão · sem trial · sem propaganda
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
