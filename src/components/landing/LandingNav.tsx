import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const LOGO_URL = "/logo-anotaAI.png";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link to="/" className="flex items-center" aria-label="AnotAI — início">
          <img
            src={LOGO_URL}
            alt="AnotAI"
            className="h-10 w-auto select-none md:h-12"
            draggable={false}
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="shadow-soft">
            <Link to="/signup">Começar grátis</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
