import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <img
        src="/logo-anotaAI.png"
        alt="AnotAI"
        className="mb-8 h-12 w-auto select-none"
        draggable={false}
      />

      <div className="card-soft w-full max-w-md p-7">
        <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>

      {footer && (
        <p className="mt-5 text-sm text-ink-soft">{footer}</p>
      )}
    </div>
  );
}
