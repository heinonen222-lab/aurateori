import { PLAY_PACKAGE, PLAY_PLANS, playEntitled } from "./play-billing";

type PlayPurchase = {
  subscriptionState: string;
  acknowledgementState: string;
  startTime?: string;
  linkedPurchaseToken?: string;
  lineItems: { productId: string; expiryTime: string; autoRenewingPlan?: { autoRenewEnabled?: boolean } }[];
};

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
export async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (v) => v.toString(16).padStart(2, "0")).join("");
}

async function accessToken() {
  const raw = process.env["GOOGLE_PLAY_SERVICE_ACCOUNT_JSON"];
  if (!raw) throw new Error("Google Play-köp är inte konfigurerade ännu.");
  const account = JSON.parse(raw) as { client_email?: string; private_key?: string };
  if (!account.client_email || !account.private_key) throw new Error("Google Play-tjänstekontot är inte korrekt konfigurerat.");
  const encode = (value: object) => base64url(new TextEncoder().encode(JSON.stringify(value)));
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: account.client_email, scope: "https://www.googleapis.com/auth/androidpublisher", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const pem = account.private_key.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const key = await crypto.subtle.importKey("pkcs8", Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${base64url(new Uint8Array(signature))}` }) });
  if (!response.ok) throw new Error(`Google Play kunde inte autentiseras (${response.status}).`);
  const result = await response.json() as { access_token?: string };
  if (!result.access_token) throw new Error("Google Play gav ingen åtkomsttoken.");
  return result.access_token;
}

export async function verifyPlayPurchase(token: string, expectedProduct?: string) {
  const auth = await accessToken();
  const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PLAY_PACKAGE}/purchases`;
  const response = await fetch(`${base}/subscriptionsv2/tokens/${encodeURIComponent(token)}`, { headers: { Authorization: `Bearer ${auth}` } });
  if (!response.ok) throw new Error(`Google Play kunde inte verifiera köpet (${response.status}).`);
  const purchase = await response.json() as PlayPurchase;
  const item = purchase.lineItems?.filter((line) => (PLAY_PLANS as readonly string[]).includes(line.productId)).sort((a,b) => Date.parse(b.expiryTime) - Date.parse(a.expiryTime))[0];
  if (!item || (expectedProduct && item.productId !== expectedProduct) || !Number.isFinite(Date.parse(item.expiryTime))) throw new Error("Köpet gäller inte en giltig Aurateori-plan.");
  const allowed = playEntitled(purchase.subscriptionState, item.expiryTime);
  return {
    purchase, item, allowed,
    acknowledge: async () => {
      if (!allowed || purchase.acknowledgementState !== "ACKNOWLEDGEMENT_STATE_PENDING") return;
      const ack = await fetch(`${base}/subscriptions/${encodeURIComponent(item.productId)}/tokens/${encodeURIComponent(token)}:acknowledge`, { method: "POST", headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" }, body: "{}" });
      if (!ack.ok) throw new Error(`Google Play kunde inte bekräfta köpet (${ack.status}).`);
    },
  };
}