import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: "É grátis mesmo?",
    a: "Sim, 100% grátis. O AnotAI é um projeto acadêmico de TCC em fase aberta — sem cartão, sem trial, sem pegadinha.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Cada usuário só vê os próprios dados (Row Level Security no Supabase) e nada é compartilhado com terceiros. O agente roda em infraestrutura própria.",
  },
  {
    q: "Funciona com qualquer número de WhatsApp?",
    a: "Sim. Após criar sua conta, basta vincular seu número no dashboard. A partir daí, qualquer mensagem que você mandar pro agente entra no seu painel.",
  },
  {
    q: "E se eu errar um valor?",
    a: 'Manda "apaga a última" ou "errei o valor da padaria" no chat. A IA confirma com você antes de deletar — sem risco de apagar algo certo.',
  },
  {
    q: "Como a categorização funciona?",
    a: "A IA escolhe entre 10 categorias (alimentação, transporte, mercado, lazer, saúde, educação, casa, assinaturas, vestuário, outros) com base no contexto da sua mensagem. Você não precisa especificar.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <header className="text-center">
          <span className="eyebrow">Dúvidas frequentes</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Perguntas, respondidas.
          </h2>
        </header>

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {ITEMS.map((item, idx) => (
            <FAQItem key={item.q} item={item} index={idx} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQItem({ item, index }: { item: QA; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-ink"
        aria-expanded={open}
      >
        <span className="flex items-center gap-4">
          <span className="num text-xs text-ink-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-semibold text-ink">{item.q}</span>
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface transition-all ${
            open ? "bg-brand text-white" : "text-ink-muted"
          }`}
          aria-hidden
        >
          {open ? (
            <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          )}
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pl-10 pr-12 text-sm leading-relaxed text-ink-soft">
            {item.a}
          </p>
        </div>
      </div>
    </li>
  );
}
