import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProblemSolution() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-12">
          {/* Coluna esquerda — headline grande, asymétrica */}
          <div className="md:col-span-7">
            <span className="eyebrow">A real</span>
            <h2 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
              Você sabe pra onde foi
              <br />
              seu dinheiro este mês?
            </h2>
          </div>

          {/* Coluna direita — narrativa */}
          <div className="md:col-span-5 md:pt-2">
            <p className="text-base leading-relaxed text-ink-soft">
              Apps de controle financeiro exigem disciplina diária:{" "}
              <span className="text-ink">abrir, classificar, salvar</span>. Em
              duas semanas você abandona — e volta a não fazer ideia do que
              torrou.
            </p>

            <div className="my-6 border-l-2 border-accent/60 pl-4">
              <p className="text-base font-medium leading-relaxed text-ink">
                O AnotAI vive no WhatsApp, o lugar onde você já passa o dia.
              </p>
            </div>

            <p className="text-base leading-relaxed text-ink-soft">
              Anotar uma despesa virou tão simples quanto mandar mensagem pra um
              amigo. O dashboard cuida do resto.
            </p>

            <Button asChild variant="link" className="mt-4 px-0">
              <Link to="/signup">
                Quero tentar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
