import { ROAD_SIGNS } from "@/data/signs";
import { SIGN_IMAGES } from "@/data/sign-images";

export function SignImage({ id, className }: { id: string; className?: string }) {
  const sign = ROAD_SIGNS.find((s) => s.id === id);
  const src = SIGN_IMAGES[id];
  if (!sign || !src) return null;
  return (
    <img
      src={src}
      alt={sign.name}
      title={sign.name}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
