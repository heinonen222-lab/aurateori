import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuraLoading, AuraState } from "@/components/AuraState";
import { adminCancelDeletion, adminDeleteNow, adminListDeletions } from "@/utils/admin.functions";

const fmt = (d: string) => new Date(d).toLocaleDateString("sv-SE");

export function AdminDeletions() {
  const qc = useQueryClient();
  const list = useServerFn(adminListDeletions);
  const cancel = useServerFn(adminCancelDeletion);
  const delNow = useServerFn(adminDeleteNow);
  const [busy, setBusy] = useState<string | null>(null);
  const q = useQuery({ queryKey: ["admin-deletions"], queryFn: () => list() });

  const run = async (id: string, kind: "cancel" | "delete") => {
    if (kind === "delete" && !confirm("Radera kontot permanent nu? Detta går inte att ångra.")) return;
    setBusy(id);
    try {
      await (kind === "cancel" ? cancel({ data: { id } }) : delNow({ data: { id } }));
      toast.success(kind === "cancel" ? "Begäran avbruten" : "Kontot är raderat");
      void qc.invalidateQueries({ queryKey: ["admin-deletions"] });
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (q.isLoading) return <AuraLoading />;
  if (q.error)
    return <AuraState icon={ShieldCheck} tone="danger" title="Raderingskön kunde inte hämtas" description={(q.error as Error).message} actionLabel="Försök igen" onAction={() => void q.refetch()} />;
  if (!q.data?.length) return <AuraState icon={ShieldCheck} title="Inga raderingsbegäranden" description="När en elev begär radering visas den här." />;

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {q.data.map((r) => {
        const days = Math.max(0, Math.ceil((new Date(r.deleteAfter).getTime() - Date.now()) / 86400000));
        return (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div className="min-w-0">
              <div className="break-all text-sm font-semibold">{r.email ?? r.userId}</div>
              <div className="text-xs text-muted-foreground">Begärd {fmt(r.requestedAt)} · raderas {fmt(r.deleteAfter)} ({days} dagar kvar)</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => void run(r.id, "cancel")}>Avbryt begäran</Button>
              <Button size="sm" variant="destructive" disabled={busy === r.id} onClick={() => void run(r.id, "delete")}>Radera nu</Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
