import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  Home,
  BookOpen,
  Timer,
  Signpost,
  Layers,
  BarChart3,
  Moon,
  Sun,
  GraduationCap,
  Crown,
} from "lucide-react";
import { store, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Start", icon: Home },
  { to: "/quiz", label: "Övning", icon: BookOpen },
  { to: "/exam", label: "Prov", icon: Timer },
  { to: "/signs", label: "Vägmärken", icon: Signpost },
  { to: "/flashcards", label: "Snabbplugg", icon: Layers },
  { to: "/genomgangar", label: "Genomgång", icon: GraduationCap },
  { to: "/stats", label: "Statistik", icon: BarChart3 },
  { to: "/priser", label: "Premium", icon: Crown },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const s = useStore();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    store.hydrate();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">
            K
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">Aurateori</div>
            <div className="text-[11px] text-muted-foreground">B-behörighet</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => store.toggleTheme()}
          className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent"
        >
          {s.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {s.theme === "dark" ? "Ljust läge" : "Mörkt läge"}
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-black text-sm">
            K
          </div>
          <span className="text-sm font-bold">Aurateori</span>
        </Link>
        <button
          onClick={() => store.toggleTheme()}
          aria-label="Byt tema"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border"
        >
          {s.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <main className="pb-24 lg:ml-64 lg:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-4 lg:px-8 lg:py-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-4 sm:grid-cols-8">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <n.icon className="h-5 w-5" />
                <span className="truncate">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
