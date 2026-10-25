import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuraLoading, AuraState } from "@/components/AuraState";
import { adminDeleteUser, adminListUsers, adminRevokePremium, adminSetBan, adminSetManualPremium, type AdminUser } from "@/utils/admin.functions";
import { getPaddleEnvironment } from "@/lib/paddle";

const LABEL: Record<AdminUser["plan"], string> = {
  free: "Gratis",
  paddle: "Premium – Paddle",
  play: "Premium – Google Play",
  manual: "Premium – Manuell",
};

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("sv-SE") : "–");
const addDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString();

export function AdminStudents() {
  const qc = useQueryClient();
  const list = useServerFn(adminListUsers);
  const setPremium = useServerFn(adminSetManualPremium);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<AdminUser | null>(null);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const revoke = useServerFn(adminRevokePremium);
  const del = useServerFn(adminDeleteUser);
  const ban = useServerFn(adminSetBan);
  const act = async (msg: string, confirmText: string | null, fn: () => Promise<unknown>) => {
    if (confirmText && !confirm(confirmText)) return;
    setBusy(true);
    try {
      await fn();
      toast.success(msg);
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });

  const apply = async (u: AdminUser, until: string | null) => {
    setBusy(true);
    try {
      await setPremium({ data: { userId: u.id, environment: getPaddleEnvironment(), until } });
      toast.success(until ? `Premium till ${fmt(until)}` : "Manuell Premium återkallad");
      setOpen(null);
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (users.isLoading) return <AuraLoading />;
  if (users.error)
    return <AuraState icon={Users} tone="danger" title="Eleverna kunde inte hämtas" description={(users.error as Error).message} actionLabel="Försök igen" onAction={() => void users.refetch()} />;

  const rows = (users.data ?? []).filter((u) => (u.email ?? "").toLowerCase().includes(q.toLowerCase()));
  const premiumCount = (users.data ?? []).filter((u) => u.plan !== "free").length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{users.data?.length ?? 0} elever · {premiumCount} med Premium</p>
      <Input placeholder="Sök e-post" value={q} onChange={(e) => setQ(e.target.value)} />
      {rows.length === 0 ? (
        <AuraState icon={Users} title="Inga elever" description="Inga konton matchar sökningen." />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {rows.map((u) => (
            <li key={u.id} className="space-y-2 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="break-all text-sm font-semibold">{u.email ?? "(ingen e-post)"}</div>
                  <div className="text-xs text-muted-foreground">Registrerad {fmt(u.createdAt)}{u.premiumUntil ? ` · Premium till ${fmt(u.premiumUntil)}` : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  {u.banned && <span className="rounded-md border border-destructive px-2 py-0.5 text-xs font-bold text-destructive">Spärrad</span>}
                  <span className={"rounded-md border px-2 py-0.5 text-xs font-bold " + (u.plan === "free" ? "border-border text-muted-foreground" : "border-premium text-premium")}>{LABEL[u.plan]}</span>
                  <Button size="sm" variant="outline" onClick={() => { setOpen(open?.id === u.id ? null : u); setCustom(""); }}>Hantera Premium</Button>
                </div>
              </div>
              {open?.id === u.id && (
                <div className="space-y-3 rounded-md border border-border bg-background p-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" disabled={busy} onClick={() => void apply(u, addDays(30))}>+1 månad</Button>
                    <Button size="sm" disabled={busy} onClick={() => void apply(u, addDays(90))}>+3 månader</Button>
                    <Button size="sm" disabled={busy} onClick={() => void apply(u, addDays(365))}>+1 år</Button>
                  </div>
                  <div className="flex flex-wrap items-end gap-2">
                    <label className="text-sm font-semibold">Eget slutdatum
                      <Input type="date" className="mt-1" value={custom} onChange={(e) => setCustom(e.target.value)} />
                    </label>
                    <Button size="sm" variant="outline" disabled={busy || !custom} onClick={() => void apply(u, new Date(custom + "T23:59:59").toISOString())}>Spara datum</Button>
                  </div>
                  {u.manualUntil && (
                    <Button size="sm" variant="ghost" className="text-destructive" disabled={busy} onClick={() => void apply(u, null)}>Återkalla manuell Premium</Button>
                  )}
                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    {u.plan !== "free" && (
                      <Button size="sm" variant="outline" className="text-destructive" disabled={busy} onClick={() => void act("All Premium borttagen", `Ta bort all Premium för ${u.email}? Paddle-abonnemang avslutas direkt utan återbetalning.`, () => revoke({ data: { userId: u.id } }))}>Ta bort all Premium</Button>
                    )}
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void act(u.banned ? "Spärren hävd" : "Kontot är spärrat", u.banned ? null : `Spärra ${u.email}? Personen kan inte logga in.`, () => ban({ data: { userId: u.id, banned: !u.banned } }))}>{u.banned ? "Häv spärr" : "Banna"}</Button>
                    <Button size="sm" variant="destructive" disabled={busy} onClick={() => void act("Kontot är raderat", `Radera ${u.email} permanent? Detta går inte att ångra.`, async () => { await del({ data: { userId: u.id } }); setOpen(null); })}>Radera konto</Button>
                  </div>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  <p className="text-xs text-muted-foreground">Manuell Premium påverkar inte köp via Paddle eller Google Play.</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
