import { BookOpen, Car, ChevronRight, Gauge, Leaf, ShieldCheck, Signpost, Triangle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { topicProgress, type TopicId } from "@/lib/practice";
import type { Question } from "@/data/questions";
import type { AppState } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS = { sign: Signpost, book: BookOpen, yield: Triangle, speed: Gauge, shield: ShieldCheck, car: Car, leaf: Leaf, person: UserRound };

export function TrainingTopics({ questions, state, selected, onSelect }: { questions: Question[]; state: AppState; selected?: TopicId | null; onSelect: (topic: TopicId) => void }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {topicProgress(questions, state).map((topic) => {
      const Icon = ICONS[topic.icon];
      return <Button key={topic.id} variant="outline" disabled={!topic.available} aria-pressed={selected === topic.id} onClick={() => onSelect(topic.id)} className={cn("group h-auto min-h-28 flex-col items-stretch justify-start gap-2 whitespace-normal rounded-xl border-border bg-card p-3.5 text-left shadow-soft hover:border-ring", selected === topic.id && "border-ring bg-accent")}>
        <div className="flex items-center justify-between"><Icon className="text-primary" /><ChevronRight className="text-muted-foreground" /></div>
        <span className="min-h-10 text-sm font-semibold leading-5">{topic.label}</span>
        <div className="mt-auto space-y-2"><div className="flex justify-between gap-1 text-[11px] font-normal text-muted-foreground"><span>{topic.answered ? `${topic.correct}/${topic.available} rätt` : "Ej påbörjad"}</span><span className="tabular-nums">{topic.percent}%</span></div><Progress value={topic.percent} aria-label={`${topic.label}: ${topic.percent}%`} className="h-1" /></div>
      </Button>;
    })}
  </div>;
}