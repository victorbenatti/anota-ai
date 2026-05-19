import {
  MessageSquare,
  Zap,
  BarChart3,
  Tags,
  Lock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: "Linguagem natural",
    description: "Sem formulários nem categorias pra preencher. Fale como você fala.",
  },
  {
    icon: Zap,
    title: "Tempo real",
    description: "Cada despesa aparece no painel no instante em que você manda.",
  },
  {
    icon: BarChart3,
    title: "Gráficos automáticos",
    description: "Veja distribuição por categoria, ritmo semanal e tendências.",
  },
  {
    icon: Tags,
    title: "Categorização inteligente",
    description: "A IA classifica entre 10 categorias com base no contexto.",
  },
  {
    icon: Lock,
    title: "Seus dados, só seus",
    description: "Row-level security no Supabase. Ninguém vê seus gastos além de você.",
  },
  {
    icon: Sparkles,
    title: "100% em português",
    description: "Pensado pro brasileiro, com formatação BRL e datas pt-BR.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="max-w-2xl">
          <span className="eyebrow">Features</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Tudo que você espera de um produto sério.{" "}
            <span className="text-ink-muted">Nada do que você não quer.</span>
          </h2>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="group card-soft p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-accent/20 group-hover:text-brand-strong">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <h3 className="mt-5 text-base font-semibold text-ink">{feature.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {feature.description}
      </p>
    </div>
  );
}
