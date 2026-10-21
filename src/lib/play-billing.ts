export const PLAY_METHOD = "https://play.google.com/billing";
export const PLAY_PACKAGE = "app.aurateori.android";
export const PLAY_PLANS = ["premium_monthly", "premium_quarterly", "premium_yearly"] as const;
export type PlayPlan = (typeof PLAY_PLANS)[number];

export interface DigitalGoodsService {
  getDetails(ids: string[]): Promise<{ itemId: string; title: string; price: { currency: string; value: string } }[]>;
  listPurchases(): Promise<{ itemId: string; purchaseToken: string }[]>;
}
declare global {
  interface Window {
    getDigitalGoodsService?: (method: string) => Promise<DigitalGoodsService>;
  }
}

export function isPlayContext() {
  return typeof window !== "undefined" && (
    new URLSearchParams(window.location.search).get("play") === "1" ||
    document.referrer.startsWith(`android-app://${PLAY_PACKAGE}`)
  );
}

export async function getPlayService() {
  if (!window.getDigitalGoodsService) return null;
  try { return await window.getDigitalGoodsService(PLAY_METHOD); }
  catch { return null; }
}

export function playEntitled(state: string, end: string, now = Date.now()) {
  return ["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD", "SUBSCRIPTION_STATE_CANCELED"].includes(state)
    && Date.parse(end) > now;
}