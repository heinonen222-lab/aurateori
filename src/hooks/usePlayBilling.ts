import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { getPlayService, isPlayContext, PLAY_METHOD, PLAY_PLANS, type DigitalGoodsService, type PlayPlan } from "@/lib/play-billing";
import { verifyPlayCheckout } from "@/utils/play-billing.functions";

let detectedPlay = false;
export function usePlayBilling() {
  const [android, setAndroid] = useState(false);
  const [service, setService] = useState<DigitalGoodsService | null>(null);
  const [details, setDetails] = useState<Awaited<ReturnType<DigitalGoodsService["getDetails"]>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verify = useServerFn(verifyPlayCheckout);
  const queryClient = useQueryClient();
  useEffect(() => {
    detectedPlay = detectedPlay || isPlayContext();
    setAndroid(detectedPlay);
    let alive = true;
    void getPlayService().then(async (goods) => {
      if (!alive || !goods) return;
      detectedPlay = true;
      setAndroid(true);
      setService(goods);
      try {
        const products = await goods.getDetails([...PLAY_PLANS]);
        if (alive) setDetails(products);
      } catch { if (alive) setError("Google Play-priserna kunde inte hämtas."); }
    });
    return () => { alive = false; };
  }, []);
  const restore = async () => {
    setLoading(true); setError(null);
    try {
      if (!service) throw new Error("Google Play-köp är inte tillgängliga i denna appversion.");
      const purchases = await service.listPurchases();
      for (const purchase of purchases) {
        if (!(PLAY_PLANS as readonly string[]).includes(purchase.itemId)) continue;
        await verify({ data: { purchaseToken: purchase.purchaseToken, productId: purchase.itemId as PlayPlan } });
      }
      await queryClient.invalidateQueries({ queryKey: ["subscription"] });
      if (!purchases.length) setError("Inga köp hittades på ditt Google Play-konto.");
    } catch (e) { setError(e instanceof Error ? e.message : "Köpen kunde inte återställas."); }
    finally { setLoading(false); }
  };
  const buy = async (plan: PlayPlan) => {
    setLoading(true); setError(null);
    let response: PaymentResponse | undefined;
    try {
      if (!service || !details.some((item) => item.itemId === plan)) throw new Error("Denna plan är inte tillgänglig i Google Play ännu.");
      const request = new PaymentRequest([{ supportedMethods: PLAY_METHOD, data: { sku: plan } }], { total: { label: "Aurateori Premium", amount: { currency: "SEK", value: "0" } } });
      response = await request.show();
      const token = (response.details as { purchaseToken?: string }).purchaseToken;
      if (!token) throw new Error("Google Play returnerade inget verifierbart köp.");
      const result = await verify({ data: { purchaseToken: token, productId: plan } });
      if (!result.allowed) throw new Error("Köpet väntar på bekräftad betalning från Google Play.");
      await response.complete("success"); response = undefined;
      await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    } catch (e) {
      if (response) await response.complete("fail").catch(() => undefined);
      setError(e instanceof Error ? e.message : "Köpet kunde inte slutföras.");
    } finally { setLoading(false); }
  };
  return { android, details, loading, error, buy, restore, available: Boolean(service) };
}