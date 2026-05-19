import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Database,
  FileText,
  Github,
  Linkedin,
  MessageCircle,
  Network,
  ShieldCheck,
  Sparkles,
  TestTube2,
  UserRoundCheck,
  Workflow,
} from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";

const academicFacts = [
  { label: "Instituição", value: "FATEC Campinas" },
  { label: "Curso", value: "Análise e Desenvolvimento de Sistemas" },
  { label: "Projeto", value: "TCC - 2026.1" },
  { label: "Orientação", value: "Prof. Thiago Salhab" },
];

const projectPillars = [
  {
    index: "I",
    title: "O problema",
    copy:
      "Registrar gastos manualmente exige disciplina, troca de contexto e tempo. Na rotina real, pequenas despesas acabam esquecidas e o controle financeiro perde precisão.",
  },
  {
    index: "II",
    title: "A solução",
    copy:
      "O AnotAI usa o WhatsApp como porta de entrada: o usuário conversa com um agente de IA, registra despesas em linguagem natural e acompanha tudo em um dashboard visual.",
  },
  {
    index: "III",
    title: "A origem",
    copy:
      "O projeto nasceu no contexto acadêmico do TCC da Faculdade de Tecnologia de Campinas, aplicando conceitos de ADS em um produto funcional e testável.",
  },
];

const creators = [
  {
    name: "Victor Benatti Alves Dos Santos",
    shortName: "Victor Benatti",
    role: "Desenvolvimento front-end, back-end e integrações",
    photo: "/ft-victor.webp",
    description:
      "Victor concentrou sua atuação na implementação técnica do AnotAI, construindo a interface do dashboard, conectando telas e apoiando a comunicação entre sistema web, banco de dados e agente de IA.",
    responsibilities: [
      "Interface web do dashboard e fluxos principais.",
      "Funcionalidades front-end e apoio na lógica back-end.",
      "Integração entre dashboard, Supabase e agente de IA.",
      "Experiência do usuário na leitura dos dados financeiros.",
    ],
    experience:
      "Atua em projetos reais pela Fast Development, incluindo agentes de IA para WhatsApp, automações com n8n, WABA, Manychat e websites para clínicas, esportes e e-commerce.",
    links: [
      { label: "GitHub", href: "https://github.com/victorbenatti", icon: Github },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/victor-benatti/",
        icon: Linkedin,
      },
      {
        label: "FastDev",
        href: "https://fastdevdigital.com.br/",
        icon: Building2,
      },
    ],
  },
  {
    name: "Mikael Henrique Lino Rodrigues",
    shortName: "Mikael Lino",
    role: "Documentação, validação, requisitos e testes",
    photo: "/ft-mikael.webp",
    description:
      "Mikael ficou mais focado na organização acadêmica e na validação do projeto, apoiando requisitos, documentação, testes, revisão de fluxos e coerência da solução.",
    responsibilities: [
      "Levantamento e organização dos requisitos.",
      "Documentação técnica e acadêmica do TCC.",
      "Validação das funcionalidades implementadas.",
      "Planejamento de testes, entregas e revisão de usabilidade.",
    ],
    experience:
      "Parceiro frequente do Victor em projetos da faculdade, desenvolveu a maioria dos projetos acadêmicos junto com ele. Atua na área de desenvolvimento e suporte na CEDET, com experiência prática em tecnologias como PHP 8.4, React e Docker. Também participa da gestão de projetos da equipe de TI, contribuindo para a organização, acompanhamento de demandas e melhoria dos processos internos.",
    links: [
      { label: "GitHub", href: "https://github.com/mikaellino", icon: Github },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/mikaelhenriquelinorodrigues/",
        icon: Linkedin,
      },
    ],
  },
];

const stackItems = [
  {
    icon: BarChart3,
    title: "React + Vite",
    copy: "Interface web responsiva para visualizar gastos, categorias, tendências e histórico financeiro.",
  },
  {
    icon: Database,
    title: "Supabase",
    copy: "Banco de dados, autenticação e realtime para refletir novas despesas no dashboard.",
  },
  {
    icon: Workflow,
    title: "n8n",
    copy: "Automação dos fluxos entre WhatsApp, agente inteligente e persistência dos registros.",
  },
  {
    icon: BrainCircuit,
    title: "IA / Gemini",
    copy: "Interpretação de mensagens em linguagem natural para transformar conversa em dados estruturados.",
  },
];

const academicFocus = [
  {
    icon: UserRoundCheck,
    title: "Usabilidade",
    copy: "Reduzir fricção no registro financeiro usando um canal que o usuário já utiliza todos os dias.",
  },
  {
    icon: Network,
    title: "Automação",
    copy: "Conectar ferramentas e serviços para criar um fluxo completo, do WhatsApp ao dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Dados",
    copy: "Organizar despesas com categorias, datas e valores em centavos para manter consistência nas análises.",
  },
  {
    icon: TestTube2,
    title: "Validação",
    copy: "Acompanhar requisitos, fluxos esperados e experiência de leitura como parte da entrega acadêmica.",
  },
];

export function About() {
  return (
    <div className="min-h-screen bg-bg">
      <LandingNav />
      <main>
        <HeroSection />
        <ProjectSection />
        <CreatorsSection />
        <BuildSection />
        <PurposeSection />
        <FinalSection />
      </main>
      <LandingFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 52% 42% at 16% 0%, hsl(var(--brand) / 0.11), transparent 64%), radial-gradient(ellipse 34% 28% at 90% 24%, hsl(var(--accent) / 0.12), transparent 72%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-16">
        <div className="reveal">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-brand shadow-soft">
              <FileText className="h-5 w-5" />
            </span>
            <span className="eyebrow">Projeto acadêmico - TCC FATEC</span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight text-ink md:text-6xl">
            Sobre o AnotAI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Um dashboard financeiro pessoal que une inteligência artificial,
            WhatsApp e educação financeira para transformar mensagens do dia a
            dia em dados claros, organizados e úteis.
          </p>

          <p className="mt-5 max-w-xl border-l-2 border-accent pl-4 text-base font-medium leading-relaxed text-ink">
            Controle financeiro que começa em uma conversa e termina em clareza.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-soft-md group">
              <Link to="/signup">
                Criar conta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Entrar no dashboard</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {academicFacts.map((fact) => (
              <div
                key={fact.label}
                className="border-t border-line pt-3"
              >
                <div className="eyebrow">{fact.label}</div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal relative" style={{ animationDelay: "120ms" }}>
          <AboutProductMockup />
        </div>
      </div>
    </section>
  );
}

function ProjectSection() {
  return (
    <SectionShell
      id="projeto"
      eyebrow="I - O projeto"
      title="Uma solução criada para caber na rotina real."
      copy="O AnotAI parte de um problema simples: controlar dinheiro exige constância, mas a vida cotidiana nem sempre respeita planilhas, apps e formulários."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {projectPillars.map((pillar) => (
          <article
            key={pillar.title}
            className="card-soft p-6 shadow-soft"
          >
            <div className="num text-sm font-semibold text-stamp">
              {pillar.index}
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {pillar.copy}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function CreatorsSection() {
  return (
    <SectionShell
      id="quem-somos"
      eyebrow="II - Quem somos"
      title="Duas frentes de trabalho, uma entrega integrada."
      copy="O projeto combina implementação técnica, documentação acadêmica, validação e refinamento de experiência para entregar uma solução coerente como produto e como TCC."
      surface
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {creators.map((creator) => (
          <article
            key={creator.name}
            className="card-soft overflow-hidden shadow-soft-md"
          >
            <div className="grid gap-0 md:grid-cols-[13rem_1fr]">
              <div className="border-b border-line bg-surface-muted p-5 md:border-b-0 md:border-r">
                <div className="aspect-[4/5] overflow-hidden rounded-md border border-line bg-bg">
                  <img
                    src={creator.photo}
                    alt={creator.shortName}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {creator.links.map((link) => {
                    const Icon = link.icon;

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="p-6">
                <div className="eyebrow">{creator.role}</div>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-ink">
                  {creator.shortName}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{creator.name}</p>

                <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                  {creator.description}
                </p>

                <div className="mt-6 border-t border-line pt-5">
                  <h4 className="text-sm font-bold text-ink">
                    Responsabilidades
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {creator.responsibilities.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 rounded-md border border-line bg-surface-muted p-4">
                  <div className="eyebrow">Experiência</div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {creator.experience}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function BuildSection() {
  return (
    <SectionShell
      id="como-construimos"
      eyebrow="III - Como construímos"
      title="Da mensagem no WhatsApp ao relatório financeiro."
      copy="A arquitetura foi pensada para separar entrada de dados, processamento inteligente, persistência e visualização. O dashboard web não cria despesas: ele lê e organiza os dados recebidos pelo fluxo automatizado."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {stackItems.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="card-soft p-5 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface-muted text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {item.copy}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-line bg-surface p-5 shadow-soft-md md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <FlowNode icon={MessageCircle} label="WhatsApp" copy="Mensagem do usuário" />
        <FlowArrow />
        <FlowNode icon={Bot} label="Agente IA" copy="Interpreta e categoriza" />
        <FlowArrow />
        <FlowNode icon={BarChart3} label="Dashboard" copy="Análise visual em tempo real" />
      </div>
    </SectionShell>
  );
}

function PurposeSection() {
  return (
    <SectionShell
      id="proposito"
      eyebrow="IV - Propósito acadêmico"
      title="Um TCC com comportamento de produto real."
      copy="Mais do que demonstrar tecnologias isoladas, o AnotAI busca aplicar conhecimentos do curso em uma experiência completa: automação, dados, interface, validação e utilidade prática."
      surface
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {academicFocus.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="border-l border-line bg-bg/45 p-5"
            >
              <Icon className="h-5 w-5 text-stamp" />
              <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {item.copy}
              </p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function FinalSection() {
  return (
    <section className="px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-line bg-brand text-primary-foreground shadow-soft-md">
        <div className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/20 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AnotAI em desenvolvimento acadêmico
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
              Conheça a experiência que conecta conversa, dados e decisão.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/78">
              Acesse o dashboard, crie sua conta ou volte para a página inicial
              para ver como o fluxo do produto funciona.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button asChild size="lg" className="bg-accent text-ink hover:bg-accent/90">
              <Link to="/signup">Criar conta</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  copy,
  children,
  surface = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
  surface?: boolean;
}) {
  return (
    <section
      id={id}
      className={`border-b border-line px-5 py-16 md:px-8 md:py-20 ${
        surface ? "bg-surface-muted/45" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-5 md:grid-cols-[0.86fr_1fr] md:items-end">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-ink md:text-4xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-ink-soft md:justify-self-end">
            {copy}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4 shadow-soft">
      <div className="eyebrow">{label}</div>
      <div className="num mt-2 text-lg font-semibold text-stamp">{value}</div>
    </div>
  );
}

function AboutProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2rem] bg-accent/10 blur-2xl"
      />

      <div className="grid gap-4">
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-soft-md">
          <header className="flex items-center gap-3 border-b border-line bg-bg/70 px-4 py-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[10px] font-bold uppercase text-primary-foreground">
              AI
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-accent" />
            </div>
            <div className="flex-1 leading-tight">
              <div className="text-sm font-semibold text-ink">AnotAI</div>
              <div className="text-[10px] text-ink-muted">online</div>
            </div>
            <span className="num text-[10px] text-ink-muted">14:03</span>
          </header>

          <div className="chat-thread-surface space-y-3 px-4 py-5">
            <div className="chat-bubble-user ml-auto max-w-[82%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-snug">
              gastei 42,90 no mercado
            </div>
            <div className="chat-bubble-bot max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2 text-sm leading-snug">
              Registrado em{" "}
              <strong className="font-semibold">mercado</strong> como{" "}
              <span className="num font-semibold text-stamp">R$ 42,90</span>.
            </div>
            <div className="chat-bubble-user ml-auto max-w-[82%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-snug">
              quanto gastei essa semana?
            </div>
            <div className="chat-bubble-bot max-w-[92%] rounded-2xl rounded-bl-md px-3.5 py-2 text-sm leading-snug">
              Total da semana:{" "}
              <span className="num font-semibold text-stamp">R$ 187,50</span>
              <br />
              <span className="text-xs text-ink-soft">
                maior categoria: alimentação
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MiniMetric label="Semana" value="R$ 187,50" />
          <MiniMetric label="Top categoria" value="Alimentação" />
        </div>

        <div className="rounded-xl border border-line bg-surface p-4 shadow-soft-md">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="eyebrow">Dashboard</span>
            <span className="num text-xs font-semibold text-accent">
              realtime
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ["Mercado", "alimentação", "R$ 42,90"],
              ["Uber", "transporte", "R$ 18,70"],
              ["Farmácia", "saúde", "R$ 26,40"],
            ].map(([name, category, amount]) => (
              <div
                key={name}
                className="grid grid-cols-[1fr_auto] gap-3 border-b border-line/70 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-semibold text-ink">{name}</div>
                  <div className="eyebrow mt-1">{category}</div>
                </div>
                <div className="num text-sm font-semibold text-stamp">
                  {amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowNode({
  icon: Icon,
  label,
  copy,
}: {
  icon: typeof MessageCircle;
  label: string;
  copy: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-surface-muted text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold text-ink">{label}</span>
        <span className="block text-xs leading-relaxed text-ink-muted">
          {copy}
        </span>
      </span>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center text-ink-muted md:flex">
      <ArrowRight className="h-5 w-5" />
    </div>
  );
}
