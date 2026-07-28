import { ROAD_SIGNS } from "@/data/signs";

export function SignImage({ id, className }: { id: string; className?: string }) {
  const sign = ROAD_SIGNS.find((s) => s.id === id);
  if (!sign) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sign.svg }}
      aria-label={sign.name}
    />
  );
}
