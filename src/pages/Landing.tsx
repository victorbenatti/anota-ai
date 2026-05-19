import { Navigate } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useAuth } from "@/hooks/useAuth";

export function Landing() {
  const { session, loading } = useAuth();

  // Se o usuário já está logado, manda direto pro dashboard.
  if (!loading && session) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-bg">
      <LandingNav />
      <main>
        <Hero />
        <HowItWorks />
        <ProblemSolution />
        <Features />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
