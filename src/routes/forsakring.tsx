import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QUESTIONS } from "@/data/questions";
import { store, useStore } from "@/lib/store";

export const Route = createFileRoute("/forsakring")({
  head: () => ({ meta: [
    { title: "Gratis försäkringsutbildning – Aurateori" },
    { name: "description", content: "Lär dig grunderna i svensk bilförsäkring med tio gratisfrågor, förklaringar och källor." },
    { property: "og:title", content: "Gratis försäkringsutbildning – Aurateori" },
    { property: "og:description", content: "Träna på trafikförsäkring, försäkringsskydd och självrisk med tio gratisfrågor." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: InsurancePage,
});

function InsurancePage() {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [round, setRound] = useState(0);
  const state = useStore();
  const latest = new Map(state.answers.map((answer) => [answer.qid, answer]));
  const learned = QUESTIONS.filter((question) => latest.get(question.id)?.correct).length;
  const question = QUESTIONS[index];
  const correct = Object.values(results).filter(Boolean).length;

  return <AppShell>
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm"><Link to="/quiz"><ArrowLeft />Till övningsfrågorna</Link></Button>
      <header>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success"><ShieldCheck className="h-5 w-5" />Gratis · 10 frågor</div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Försäkringsutbildning</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Trafikförsäkring, skydd för bilen och ditt ansvar som bilägare. Ingen Premium krävs.</p>
      </header>
      <details className="border-y border-border py-4">
        <summary className="cursor-pointer text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Kort genomgång: bilens försäkringar</summary>
        <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
          <p><strong className="text-foreground">Trafikförsäkring:</strong> En påställd bil måste vara trafikförsäkrad även när den står parkerad. Försäkringen ersätter personskador och skador på andras egendom, men inte skador på din egen bil.</p>
          <p><strong className="text-foreground">Halv- och helförsäkring:</strong> Halvförsäkring innehåller vanligtvis bland annat stöld-, brand- och glasskydd. Helförsäkring inkluderar dessutom vagnskada. Skydd, undantag och självrisk varierar mellan försäkringar.</p>
          <p><strong className="text-foreground">Självrisk:</strong> Den del av en ersättningsbar skada som du själv betalar. Läs alltid försäkringsvillkoren och anmäl en skada till försäkringsbolaget.</p>
        </div>
      </details>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Senaste svar: {learned} av 10 rätt</p>
        <Progress value={index / QUESTIONS.length * 100} aria-label="Framsteg i försäkringsutbildningen" />
      </div>
      {question ? <QuestionCard key={`${round}-${question.id}`} question={question} index={index} total={QUESTIONS.length}
        onAnswer={(ok) => { store.recordAnswer(question.id, question.category, ok); setResults((previous) => ({ ...previous, [question.id]: ok })); }}
        onNext={() => setIndex((previous) => previous + 1)} /> : <section className="space-y-4 border-y border-border py-8 text-center" aria-live="polite">
          <ShieldCheck className="mx-auto h-10 w-10 text-success" />
          <h2 className="font-display text-2xl font-bold">Utbildningen genomförd</h2>
          <p className="text-lg font-semibold">{correct} rätt · {QUESTIONS.length - correct} fel · {Math.round(correct / QUESTIONS.length * 100)} %</p>
          <p className="text-sm text-muted-foreground">{correct === QUESTIONS.length ? "Alla tio rätt – bra jobbat!" : "Repetera förklaringarna för att förstå försäkringsskyddet bättre."}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => { setIndex(0); setResults({}); setRound((previous) => previous + 1); }}><RotateCcw />Träna igen</Button>
            <Button asChild variant="outline"><Link to="/stats">Mina resultat</Link></Button>
          </div>
        </section>}
    </div>
  </AppShell>;
}