import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
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
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { store, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LegalFooter } from "@/components/LegalFooter";
import { AccountMenu } from "@/components/AccountMenu";

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

const PRIMARY_NAV = NAV.slice(0, 4);
const MORE_NAV = NAV.slice(4);

function NavLink({
  item,
  active,
  onClick,
  variant = "bottom",
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick?: () => void;
  variant?: "bottom" | "sheet";
}) {
  return (
    <Link
      key={item.to}
      to={item.to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg transition-[background-color,color,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "bottom"
          ? "flex-col justify-center gap-0.5 px-0.5 py-2 text-[10px] font-semibold"
          : "px-4 py-3 text-sm font-medium",
        active ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        variant === "sheet" && active && "bg-accent text-accent-foreground",
      )}
    >
      <item.icon className={cn(variant === "bottom" ? "h-5 w-5" : "h-5 w-5")} />
      <span className={cn(variant === "bottom" && "w-full truncate text-center")}>{item.label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const s = useStore();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    store.hydrate();
  }, []);

  const isMoreActive = MORE_NAV.some((n) =>
    n.to === "/" ? pathname === "/" : pathname.startsWith(n.to),
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#innehall"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:border focus-visible:border-border focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold"
      >
        Hoppa till innehållet
      </a>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex">
        <Link to="/" className="mb-8 flex min-h-11 items-center gap-3 rounded-lg px-2 focus-visible:ring-sidebar-ring">
          <img
            src="/apple-touch-icon.png"
            alt="Aurateori"
            className="h-9 w-9 rounded-lg shadow-soft"
          />
          <div>
            <div className="font-display text-base font-extrabold leading-tight">Aurateori</div>
            <div className="text-[10px] font-medium uppercase text-sidebar-foreground/55">B-behörighet</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1" aria-label="Huvudnavigation">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.98] focus-visible:ring-sidebar-ring",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  n.to === "/priser" && !active && "text-premium",
                )}
              >
                <n.icon className="h-[18px] w-[18px] shrink-0" />
                {n.label}
                {n.to === "/priser" && <Sparkles className="ml-auto h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border pt-3">
          <AccountMenu />
        </div>
        <button
          onClick={() => store.toggleTheme()}
          className="mt-1 flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-sidebar-ring"
        >
          {s.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {s.theme === "dark" ? "Ljust läge" : "Mörkt läge"}
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <Link to="/" className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-ring">
          <img
            src="/apple-touch-icon.png"
            alt="Aurateori"
            className="h-8 w-8 shrink-0 rounded-md shadow-soft"
          />
          <span className="truncate font-display text-base font-extrabold">Aurateori</span>
        </Link>
        <button
          onClick={() => store.toggleTheme()}
          aria-label="Byt tema"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-card transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          {s.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <main id="innehall" className="pb-[calc(5rem+env(safe-area-inset-bottom))] lg:ml-60 lg:pb-10">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
          <LegalFooter />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_color-mix(in_oklab,var(--foreground)_7%,transparent)] backdrop-blur-xl lg:hidden" aria-label="Mobilnavigation">
        <div className="mx-auto grid max-w-md grid-cols-5 px-1">
          {PRIMARY_NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return <NavLink key={n.to} item={n} active={active} />;
          })}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-2 text-[10px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  isMoreActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Fler sidor"
              >
                {moreOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span>Mer</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
              <SheetHeader className="sr-only">
                <SheetTitle>Fler sidor</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {MORE_NAV.map((n) => {
                  const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                  return (
                    <NavLink
                      key={n.to}
                      item={n}
                      active={active}
                      variant="sheet"
                      onClick={() => setMoreOpen(false)}
                    />
                  );
                })}
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <AccountMenu variant="sheet" onNavigate={() => setMoreOpen(false)} />
              </div>
              <button
                onClick={() => {
                  store.toggleTheme();
                  setMoreOpen(false);
                }}
                className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {s.theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" /> Ljust läge
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" /> Mörkt läge
                  </>
                )}
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
