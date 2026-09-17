import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { askAssistant } from "@/utils/assistant.functions";

export const Route = createFileRoute("/assistent")({
  head: () => ({
    meta: [
      { title: "AI-assistent – fråga om teorin | Aurateori" },
      {
        name: "description",
        content:
          "Ställ frågor om svenska trafikregler, vägmärken och teoriprovet och få svar direkt i Aurateori, byggda på appens frågebank och genomgångar.",
      },
      { property: "og:title", content: "AI-assistent – fråga om teorin | Aurateori" },
      {
        property: "og:description",
        content: "Fråga Aurateoris assistent om trafikregler och vägmärken och få svar direkt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Vem har företräde i en cirkulationsplats?",
  "Vad betyder ett triangelformat märke med ett rött streck?",
  "Hur långt är reaktionssträckan vid 70 km/h?",
  "När gäller högerregeln – och när gäller den inte?",
];

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const answer = await ask({ data: { messages: next.slice(-10) } });
      setMessages([...next, { role: "assistant", content: answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black sm:text-3xl">
            <Sparkles className="h-6 w-6 text-primary" /> AI-assistent
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Fråga om trafikregler, vägmärken eller en fråga du svarade fel på. Assistenten svarar
            utifrån Aurateoris frågebank, vägmärkesarkiv och genomgångar.
          </p>
        </div>

        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Kom igång
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-xl border border-border bg-background p-3 text-left text-sm transition hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto flex max-w-[85%] items-start gap-2 rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                  : "flex max-w-[95%] items-start gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
              }
            >
              {m.role === "user" ? (
                <User className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
              ) : (
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              )}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Tänker…
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="sticky bottom-20 flex gap-2 rounded-2xl border border-border bg-background/95 p-2 backdrop-blur sm:bottom-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skriv din fråga…"
            maxLength={2000}
            className="min-w-0 flex-1 rounded-xl bg-muted px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Skicka
          </button>
        </form>

        <p className="text-xs text-muted-foreground">
          Vill du i stället använda ChatGPT eller Claude? Se{" "}
          <Link to="/connect" className="text-primary underline">
            Anslut en AI-assistent
          </Link>
          . Assistenten kan ha fel – dubbelkolla alltid mot Trafikverket och Transportstyrelsen.
        </p>
      </div>
    </AppShell>
  );
}
