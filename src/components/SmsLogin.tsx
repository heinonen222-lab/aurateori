import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeSwedishMobile } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground";

export function SmsLogin() {
  const [phone, setPhone] = useState("");
  const [e164, setE164] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const n = normalizeSwedishMobile(phone);
    if (!n) return setError("Ange ett svenskt mobilnummer, t.ex. 070-123 45 67.");
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({ phone: n });
    setBusy(false);
    if (err) return setError(/provider|disabled|unsupported/i.test(err.message)
      ? "SMS-inloggning är inte aktiverad ännu. Försök igen senare."
      : "Kunde inte skicka SMS. Kontrollera numret och försök igen.");
    setE164(n);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!e164) return;
    setError(null);
    setBusy(true);
    const { error: err } = await supabase.auth.verifyOtp({ phone: e164, token: code.trim(), type: "sms" });
    setBusy(false);
    if (err) setError("Fel eller utgången kod. Försök igen.");
  };

  return (
    <div className="space-y-3">
      {!e164 ? (
        <form onSubmit={send} className="space-y-3">
          <div>
            <label htmlFor="sms-phone" className={labelCls}>Mobilnummer</label>
            <Input id="sms-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="070-123 45 67"
              required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button type="submit" variant="outline" disabled={busy} className="w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            Logga in med SMS-kod
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <div>
            <label htmlFor="sms-code" className={labelCls}>Kod skickad till {e164}</label>
            <Input id="sms-code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6}
              placeholder="6 siffror" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
          </div>
          <Button type="submit" disabled={busy || code.length !== 6} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}Verifiera och logga in
          </Button>
          <button type="button" onClick={() => { setE164(null); setCode(""); }}
            className="min-h-11 w-full rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            Byt nummer
          </button>
        </form>
      )}
      {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs">{error}</p>}
    </div>
  );
}
