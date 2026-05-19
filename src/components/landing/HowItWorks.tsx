import { UserPlus, Smartphone, MessageCircle, type LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Em 30 segundos com e-mail e senha. Sem cartão.",
  },
  {
    icon: Smartphone,
    number: "02",
    title: "Vincule seu WhatsApp",
    description: "Um campo no dashboard. Número confirmado, conta pronta.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Comece a conversar",
    description: '"gastei 30 na padaria" e pronto. O dashboard atualiza em tempo real.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Como funciona</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Três passos. Sem fricção.
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            Sem onboarding chato, sem tour interativo, sem aprender categorias.
          </p>
        </header>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Linha tracejada conectando os 3 passos em desktop */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-7 hidden border-t border-dashed border-line md:block"
          />

          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;
  return (
    <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-bg shadow-soft">
        <Icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
        <span className="num absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-bg">
          {step.number}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink-soft">
        {step.description}
      </p>
    </div>
  );
}
