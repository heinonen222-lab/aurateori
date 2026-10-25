import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { ROAD_SIGNS } from "@/data/signs";
import { SignImage } from "@/components/SignImage";
import { QuestionReference } from "@/components/QuestionReference";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AuraState, AuraLoading } from "@/components/AuraState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdminStudents } from "@/components/AdminStudents";
import { AdminDeletions } from "@/components/AdminDeletions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Adminpanel – Aurateori" },
      { name: "description", content: "Hantera frågebanken i Aurateori." },
      { property: "og:title", content: "Adminpanel – Aurateori" },
      { property: "og:description", content: "Lägg till, ändra och ta bort frågor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const CATEGORIES = ["Vägmärken", "Trafikregler", "Miljö", "Människan & Trafiken", "Fordonskännedom"];
const DIFFICULTIES = ["lätt", "medel", "svår"];

type Row = {
  id: string;
  category: string;
  question: string;
  options: unknown;
  correct: number;
  explanation: string;
  reference: string;
  difficulty: string;
  image: string | null;
};

type Draft = Omit<Row, "options"> & { options: string[] };

const EMPTY: Draft = {
  id: "",
  category: CATEGORIES[0],
  question: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
  reference: "",
  difficulty: "medel",
  image: null,
};

const fieldCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function AdminPage() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<"questions" | "students" | "gdpr">("questions");

  const role = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });

  const list = useQuery({
    queryKey: ["admin-questions"],
    enabled: role.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_questions")
        .select("id, category, question, options, correct, explanation, reference, difficulty, image")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Row[];
    },
  });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin-questions"] });
    void qc.invalidateQueries({ queryKey: ["ai-questions"] });
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.question.trim() || draft.options.some((o) => !o.trim()) || !draft.explanation.trim() || !draft.reference.trim()) {
      toast.error("Fyll i fråga, alla fyra alternativ, förklaring och källa.");
      return;
    }
    setSaving(true);
    const payload = {
      category: draft.category,
      question: draft.question.trim(),
      options: draft.options.map((o) => o.trim()),
      correct: draft.correct,
      explanation: draft.explanation.trim(),
      reference: draft.reference.trim(),
      difficulty: draft.difficulty,
      image: draft.image || null,
    };
    const { error } = draft.id
      ? await supabase.from("ai_questions").update(payload).eq("id", draft.id)
      : await supabase.from("ai_questions").insert(payload);
    setSaving(false);
    if (error) return toast.error("Kunde inte spara: " + error.message);
    toast.success(draft.id ? "Frågan är uppdaterad" : "Frågan är tillagd");
    setDraft(null);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort frågan permanent?")) return;
    const { error } = await supabase.from("ai_questions").delete().eq("id", id);
    if (error) return toast.error("Kunde inte ta bort: " + error.message);
    toast.success("Frågan är borttagen");
    refresh();
  };

  if (loading || (user && role.isLoading)) return <AppShell><AuraLoading /></AppShell>;
  if (!user)
    return (
      <AppShell>
        <AuraState icon={ShieldCheck} title="Logga in först" description="Adminpanelen kräver inloggning.">
          <Button asChild><Link to="/auth">Logga in</Link></Button>
        </AuraState>
      </AppShell>
    );
  if (!role.data)
    return (
      <AppShell>
        <AuraState icon={ShieldCheck} tone="danger" title="Ingen behörighet" description="Ditt konto är inte admin." />
      </AppShell>
    );

  const rows = (list.data ?? []).filter((r) =>
    (r.question + r.category).toLowerCase().includes(filter.toLowerCase()),
  );

  const TABS = [
    { id: "questions", label: "Frågor" },
    { id: "students", label: "Elever & Premium" },
    { id: "gdpr", label: "Raderingskö" },
  ] as const;

  return (
    <AppShell>
      <section className="space-y-6">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={() => (draft ? setDraft(null) : window.history.length > 1 ? window.history.back() : (window.location.href = "/"))}>
          <ArrowLeft className="h-4 w-4" /> {draft ? "Tillbaka till listan" : "Gå tillbaka"}
        </Button>
        <div role="tablist" aria-label="Adminsektioner" className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={"min-h-11 flex-1 whitespace-nowrap rounded-md px-3 text-sm font-semibold transition-colors " + (tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === "students" && <AdminStudents />}
        {tab === "gdpr" && <AdminDeletions />}
        {tab === "questions" && (<>
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-premium" /> Admin
            </div>
            <h1 className="mt-1 font-display text-2xl font-extrabold">Frågebanken</h1>
            <p className="text-sm text-muted-foreground">{list.data?.length ?? 0} frågor</p>
          </div>
          <Button onClick={() => setDraft({ ...EMPTY, options: ["", "", "", ""] })}>
            <Plus className="h-4 w-4" /> Ny fråga
          </Button>
        </header>

        {draft && (
          <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-soft">
            <h2 className="font-display text-lg font-bold">{draft.id ? "Ändra fråga" : "Ny fråga"}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold">Kategori
                <select className={fieldCls + " mt-1"} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold">Svårighetsgrad
                <select className={fieldCls + " mt-1"} value={draft.difficulty} onChange={(e) => setDraft({ ...draft, difficulty: e.target.value })}>
                  {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
            </div>
            <div className="flex items-start gap-3">
              <label className="block flex-1 text-sm font-semibold">Vägmärkesbild (valfritt)
                <select className={fieldCls + " mt-1"} value={draft.image ?? ""} onChange={(e) => setDraft({ ...draft, image: e.target.value || null })}>
                  <option value="">Ingen bild</option>
                  {ROAD_SIGNS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              {draft.image && <SignImage id={draft.image} className="h-16 w-16 shrink-0" />}
            </div>
            <label className="block text-sm font-semibold">Fråga
              <textarea className={fieldCls + " mt-1"} rows={2} value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
            </label>
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">Svarsalternativ (markera det rätta)</legend>
              {draft.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" aria-label={`Alternativ ${i + 1} är rätt`} className="h-5 w-5 accent-primary" checked={draft.correct === i} onChange={() => setDraft({ ...draft, correct: i })} />
                  <Input value={o} placeholder={`Alternativ ${i + 1}`} onChange={(e) => {
                    const options = [...draft.options];
                    options[i] = e.target.value;
                    setDraft({ ...draft, options });
                  }} />
                </div>
              ))}
            </fieldset>
            <label className="block text-sm font-semibold">Förklaring
              <textarea className={fieldCls + " mt-1"} rows={3} value={draft.explanation} onChange={(e) => setDraft({ ...draft, explanation: e.target.value })} />
            </label>
            <label className="block text-sm font-semibold">Källa/referens
              <Input className="mt-1" value={draft.reference} placeholder="t.ex. Trafikförordningen 3 kap. 18 §" onChange={(e) => setDraft({ ...draft, reference: e.target.value })} />
            </label>
            {draft.reference.trim() && <QuestionReference question={{ reference: draft.reference, category: draft.category as import("@/data/questions").QuestionCategory, question: draft.question }} />}
            <div className="flex gap-2">
              <Button onClick={() => void save()} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Spara
              </Button>
              <Button variant="outline" onClick={() => setDraft(null)}>Avbryt</Button>
            </div>
          </div>
        )}

        <Input placeholder="Sök fråga eller kategori" value={filter} onChange={(e) => setFilter(e.target.value)} />

        {list.isLoading ? (
          <AuraLoading />
        ) : list.error ? (
          <AuraState icon={ShieldCheck} tone="danger" title="Frågorna kunde inte hämtas" description={String((list.error as Error).message)} actionLabel="Försök igen" onAction={() => void list.refetch()} />
        ) : rows.length === 0 ? (
          <AuraState icon={ShieldCheck} title="Inga frågor" description="Lägg till din första fråga med knappen ovan." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {rows.map((r) => (
              <li key={r.id} className="flex items-start gap-3 p-3">
                {r.image && <SignImage id={r.image} className="h-10 w-10 shrink-0" />}
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">{r.category} · {r.difficulty}</div>
                  <div className="break-words text-sm font-semibold">{r.question}</div>
                </div>
                <Button size="icon" variant="ghost" aria-label="Ändra" onClick={() => {
                  setDraft({ ...r, options: Array.isArray(r.options) ? r.options.map(String) : ["", "", "", ""] });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Ta bort" onClick={() => void remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </li>
            ))}
          </ul>
        )}
        </>)}
      </section>
    </AppShell>
  );
}
