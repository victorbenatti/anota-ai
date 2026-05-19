import { CheckCheck } from "lucide-react";

// Mockup auto-animado de conversa WhatsApp. Animação 100% CSS (keyframes
// em index.css) com loop de 12s. Visualmente: container "tela flutuando"
// com leve tilt 3D e sombra suave.
export function WhatsappChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Halo decorativo lima atrás do mockup */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-accent/10 blur-2xl"
      />

      <div
        className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_24px_60px_-20px_rgba(18,48,43,0.25)] [transform:perspective(1200px)_rotateY(-6deg)_rotateX(4deg)]"
        role="img"
        aria-label="Demonstração de uma conversa entre o usuário e o agente AnotAI"
      >
        {/* Header tipo WhatsApp */}
        <header className="flex items-center gap-3 border-b border-line bg-bg/60 px-4 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[10px] font-bold uppercase text-white">
            AI
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-accent" />
          </div>
          <div className="flex-1 leading-tight">
            <div className="text-sm font-semibold text-ink">AnotAI</div>
            <div className="text-[10px] text-ink-muted">online</div>
          </div>
          <span className="num text-[10px] text-ink-muted">agora</span>
        </header>

        {/* Corpo da conversa */}
        <div className="chat-thread-surface flex flex-col gap-2.5 px-4 py-5">
          {/* 1. Bot greeting */}
          <BotBubble className="chat-anim-1">
            Oi! Sou o AnotAI 👋 me conta seus gastos quando quiser.
          </BotBubble>

          {/* 2. User: gastei 30 */}
          <UserBubble className="chat-anim-2" time="14:02">
            gastei 30 na padaria
          </UserBubble>

          {/* 3. Bot typing */}
          <TypingIndicator className="chat-typing-anim-1" />

          {/* 4. Bot confirm */}
          <BotBubble className="chat-anim-3" time="14:02">
            ✅ R$ 30,00 em <strong className="font-semibold">alimentação</strong> registrado.
          </BotBubble>

          {/* 5. User: query */}
          <UserBubble className="chat-anim-4" time="14:03">
            quanto gastei essa semana?
          </UserBubble>

          {/* 6. Bot typing */}
          <TypingIndicator className="chat-typing-anim-2" />

          {/* 7. Bot summary */}
          <BotBubble className="chat-anim-5" time="14:03">
            📊 Total <span className="num font-semibold text-stamp">R$ 187,50</span>
            <br />
            <span className="text-xs text-ink-soft">
              top 3 · alimentação R$95 · transporte R$48 · lazer R$30
            </span>
          </BotBubble>
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-componentes internos ----------

function BotBubble({
  children,
  className = "",
  time,
}: {
  children: React.ReactNode;
  className?: string;
  time?: string;
}) {
  return (
    <div className={`flex max-w-[85%] flex-col ${className}`}>
      <div className="chat-bubble-bot rounded-2xl rounded-bl-md px-3.5 py-2 text-sm leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        {children}
      </div>
      {time && (
        <span className="num mt-0.5 self-start pl-2 text-[9px] text-ink-muted">
          {time}
        </span>
      )}
    </div>
  );
}

function UserBubble({
  children,
  className = "",
  time,
}: {
  children: React.ReactNode;
  className?: string;
  time?: string;
}) {
  return (
    <div className={`flex max-w-[85%] flex-col self-end ${className}`}>
      <div className="chat-bubble-user flex items-end gap-1.5 rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <span>{children}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-1 self-end pr-2">
        {time && (
          <span className="num text-[9px] text-ink-muted">{time}</span>
        )}
        <CheckCheck className="h-3 w-3 text-[#53bdeb]" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function TypingIndicator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex max-w-[60px] ${className}`}>
      <div className="chat-bubble-bot flex items-center gap-1 rounded-2xl rounded-bl-md px-3 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <span className="typing-dot-anim h-1.5 w-1.5 rounded-full bg-ink-muted" />
        <span className="typing-dot-anim h-1.5 w-1.5 rounded-full bg-ink-muted" />
        <span className="typing-dot-anim h-1.5 w-1.5 rounded-full bg-ink-muted" />
      </div>
    </div>
  );
}
