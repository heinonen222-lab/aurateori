import { ChevronDown, ExternalLink } from "lucide-react";
import type { Question } from "@/data/questions";
import { getQuestionSources } from "@/lib/question-sources";

export function QuestionReference({ question }: { question: Pick<Question, "reference" | "category" | "source" | "question"> }) {
  const { links, note } = getQuestionSources(question);
  return <div className="mt-3 text-xs text-muted-foreground">
    <p className="break-words"><strong>Referens:</strong> {question.reference}</p>
    {links.length > 0 && <details className="group mt-1">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 font-medium text-primary [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        Källor ({links.length})<ChevronDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="flex flex-wrap gap-2 pb-1">
        {links.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="break-words">{source.label}</span><ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" /><span className="sr-only"> (öppnas i ny flik)</span>
        </a></li>)}
      </ul>
      {note && <p className="leading-relaxed">{note}</p>}
    </details>}
  </div>;
}
