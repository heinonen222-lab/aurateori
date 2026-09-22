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
      className={cn(
        "flex items-center gap-3 rounded-xl transition-colors",
        variant === "bottom"
          ? "flex-col justify-center gap-0.5 py-2 text-[11px] font-semibold"
          : "px-4 py-3 text-sm font-medium",
        active ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        variant === "sheet" && active && "bg-primary/10 text-primary",
      )}
    >
      <item.icon className={cn(variant === "bottom" ? "h-5 w-5" : "h-5 w-5")} />
      <span className={cn(variant === "bottom" && "truncate max-w-[4.5rem]")}>{item.label}</span>
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
        <div className="mt-auto border-t border-border pt-3">
          <AccountMenu />
        </div>
        <button
          onClick={() => store.toggleTheme()}
          className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent"
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

      <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:ml-64 lg:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-5 lg:px-8 lg:py-8">
          {children}
          <LegalFooter />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 px-1">
          {PRIMARY_NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return <NavLink key={n.to} item={n} active={active} />;
          })}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-colors",
                  isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Fler sidor"
              >
                {moreOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span>Mer</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-4">
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
