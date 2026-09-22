import { createFileRoute, useHydrated } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Bot, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Anslut en AI-assistent – Aurateori" },
      {
        name: "description",
        content:
          "Koppla ChatGPT, Claude eller Claude Code till Aurateoris MCP-server och låt assistenten söka i frågebanken, vägmärkesarkivet och genomgångarna.",
      },
      { property: "og:title", content: "Anslut en AI-assistent – Aurateori" },
      {
        property: "og:description",
        content: "Koppla din AI-assistent till Aurateori via MCP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectPage,
});

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Kopierat!" : "Kopiera"}
    </button>
  );
}

function Steps({ title, steps }: { title: string; steps: React.ReactNode[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold">{title}</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

function ConnectPage() {
  const hydrated = useHydrated();
  const mcpUrl = hydrated ? new URL("/mcp", window.location.origin).toString() : "/mcp";
  const claudeAddUrl = `https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=${encodeURIComponent("Aurateori")}&connectorUrl=${encodeURIComponent(mcpUrl)}`;
  const claudeCodeCmd = `claude mcp add --scope user --transport http aurateori '${mcpUrl.replace(/'/g, "'\\''")}'`;

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Anslut en AI-assistent</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Aurateori har en inbyggd MCP-server. Koppla den till ChatGPT, Claude eller en annan
            AI-assistent så kan assistenten söka i frågebanken, vägmärkesarkivet och
            genomgångarna – och se din Premium-status.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Bot className="h-4 w-4" /> Serveradress
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <code className="break-all rounded-lg bg-background px-3 py-2 text-sm">{mcpUrl}</code>
            <CopyButton text={mcpUrl} />
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">Koppla upp dig</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Steps
              title="ChatGPT"
              steps={[
                <>
                  Öppna{" "}
                  <a
                    className="text-primary underline"
                    href="https://chatgpt.com/#settings/Connectors/Advanced"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ChatGPT:s inställningar för appar
                  </a>{" "}
                  och slå på utvecklarläge (följ varningen som visas). Saknas alternativet? Be din
                  ChatGPT-administratör aktivera det.
                </>,
                <>
                  Öppna{" "}
                  <a
                    className="text-primary underline"
                    href="https://chatgpt.com/plugins#settings/Connectors?create-connector=true&redirectAfter=%2Fplugins"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dialogen för ny app
                  </a>
                  .
                </>,
                "Klistra in namnet Aurateori och serveradressen ovan i fälten.",
                "Granska uppgifterna, bocka i ”I understand and want to continue” (ChatGPT visar varningen för alla egna MCP-servrar) och klicka Create.",
                "Aktivera appen i chatten och be ChatGPT använda Aurateori.",
              ]}
            />
            <Steps
              title="Claude"
              steps={[
                <>
                  Öppna{" "}
                  <a
                    className="text-primary underline"
                    href={claudeAddUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    den förifyllda dialogen i Claude
                  </a>
                  .
                </>,
                "Granska uppgifterna och klicka Add.",
                "Om dialogen inte öppnas: gå till Claudes sida för connectors, välj ”Add custom connector”, namnge kopplingen och klistra in serveradressen.",
                "Aktivera kopplingen i chatten och be Claude använda Aurateori.",
              ]}
            />
            <Steps
              title="Claude Code"
              steps={[
                "Kör detta kommando i en terminal:",
                <code className="block break-all rounded-lg bg-muted px-3 py-2 text-xs">
                  {claudeCodeCmd}
                </code>,
                <>
                  Starta Claude Code och kör <code>/mcp</code> för att se att Aurateori är
                  ansluten. Logga in via menyn om du blir ombedd.
                </>,
                "Be Claude Code använda Aurateori.",
              ]}
            />
            <Steps
              title="Andra MCP-klienter"
              steps={[
                "Öppna klientens inställningar för MCP-servrar eller egna connectors.",
                "Skapa en koppling till en fjärr-MCP-server.",
                "Namnge kopplingen och klistra in serveradressen ovan.",
                "Slutför eventuell inloggning eller godkännande.",
                "Aktivera kopplingen och be assistenten använda Aurateori.",
              ]}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <RefreshCw className="h-5 w-5" /> Uppdatera när appen ändras
          </h2>
          <p className="text-sm text-muted-foreground">
            En ansluten assistent sparar verktygslistan. När Aurateori uppdateras behöver du
            uppdatera kopplingen för att få de senaste verktygen.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Steps
              title="ChatGPT"
              steps={[
                "Öppna ChatGPT:s Plugins-sida och välj Aurateori.",
                "Scrolla ner till ”Information” och klicka Refresh.",
                "ChatGPT kan inte ändra adressen på en befintlig app – har den bytts tar du bort appen och gör om stegen ovan med den nya adressen.",
                "Starta en ny chatt och be ChatGPT använda Aurateori.",
              ]}
            />
            <Steps
              title="Claude"
              steps={[
                "Öppna Connectors-sidan och välj Aurateori.",
                "Uppdatera connectorns verktyg.",
                "Claude kan inte ändra adressen på en befintlig connector – har den bytts tar du bort connectorn och gör om stegen ovan med den nya adressen.",
                "Be Claude använda Aurateori.",
              ]}
            />
            <Steps
              title="Claude Code"
              steps={[
                "Starta en ny Claude Code-session – den laddar de senaste verktygen vid anslutning.",
                <>
                  Har adressen bytts: kör <code>claude mcp remove aurateori</code> och kör sedan
                  installationskommandot ovan igen.
                </>,
                "Be Claude Code använda Aurateori.",
              ]}
            />
            <Steps
              title="Andra MCP-klienter"
              steps={[
                "Öppna klientens inställningar för MCP-servrar eller connectors.",
                "Välj kopplingen du skapade för Aurateori.",
                "Uppdatera verktygslistan, ladda om servern eller anslut på nytt.",
                "Har adressen bytts klistrar du in den nya adressen ovan.",
                "Starta en ny chatt eller session och be assistenten använda Aurateori.",
              ]}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
