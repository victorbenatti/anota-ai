import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, type Location } from "react-router-dom";
import { cn } from "@/lib/utils";

type TransitionPhase = "idle" | "covering" | "revealing";

type RouteTransitionProps = {
  children: (location: Location) => ReactNode;
};

const COVER_MS = 360;
const REVEAL_MS = 420;

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [phase, setPhase] = useState<TransitionPhase>("idle");

  const shouldAnimate = useMemo(
    () => shouldAnimateRouteChange(displayLocation.pathname, location.pathname),
    [displayLocation.pathname, location.pathname]
  );

  useEffect(() => {
    if (location.key === displayLocation.key) return;

    if (!shouldAnimate || prefersReducedMotion()) {
      setDisplayLocation(location);
      setPhase("idle");
      return;
    }

    setPhase("covering");

    const swapTimer = window.setTimeout(() => {
      setDisplayLocation(location);
      setPhase("revealing");
    }, COVER_MS);

    const doneTimer = window.setTimeout(() => {
      setPhase("idle");
    }, COVER_MS + REVEAL_MS);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(doneTimer);
    };
  }, [displayLocation.key, location, shouldAnimate]);

  return (
    <>
      {children(displayLocation)}
      <RouteTransitionOverlay phase={phase} />
    </>
  );
}

function RouteTransitionOverlay({ phase }: { phase: TransitionPhase }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "route-transition pointer-events-none fixed inset-0 z-[9999] overflow-hidden",
        phase === "covering" && "route-transition-covering",
        phase === "revealing" && "route-transition-revealing"
      )}
    >
      <div className="route-transition-panel" />
      <div className="route-transition-glow" />
      <div className="route-transition-mark">
        <span className="route-transition-line" />
        <span className="route-transition-dot" />
      </div>
    </div>
  );
}

function shouldAnimateRouteChange(from: string, to: string) {
  const fromZone = getRouteZone(from);
  const toZone = getRouteZone(to);

  if (fromZone === toZone) return false;

  return (
    (fromZone === "landing" && toZone === "auth") ||
    (fromZone === "auth" && toZone === "landing") ||
    (fromZone === "auth" && toZone === "app") ||
    (fromZone === "app" && toZone === "auth")
  );
}

function getRouteZone(pathname: string) {
  if (pathname === "/") return "landing";
  if (pathname === "/login" || pathname === "/signup") return "auth";
  if (pathname.startsWith("/app")) return "app";
  return "other";
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
