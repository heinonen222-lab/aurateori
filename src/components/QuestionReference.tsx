import { ExternalLink } from "lucide-react";
import type { Question } from "@/data/questions";
import { getQuestionSources } from "@/lib/question-sources";

export function QuestionReference({ question }: { question: Pick<Question, "reference" | "category" | "source" | "question"> }) {
  const { links, note } = getQuestionSources(question);
  return <div className="mt-3 space-y-1 text-xs text-muted-foreground">
    <p className="break-words"><strong>Referens:</strong> {question.reference}</p>
    <ul className="space-y-1">
      {links.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="break-words">{source.label}</span><ExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /><span className="sr-only"> (öppnas i ny flik)</span>
      </a></li>)}
    </ul>
    {note && <p className="leading-relaxed">{note}</p>}
  </div>;
}