import { useCallback, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AutoFitTextProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  maxSize?: number;
  minSize?: number;
};

export function AutoFitText({
  children,
  className,
  maxSize = 16,
  minSize = 10,
  ...props
}: AutoFitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    let size = maxSize;
    node.style.fontSize = `${size}px`;
    while ((node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight) && size > minSize) {
      size -= 0.5;
      node.style.fontSize = `${size}px`;
    }
  }, [maxSize, minSize]);

  useEffect(() => {
    fit();
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children, fit]);

  return (
    <span
      ref={ref}
      className={cn("block min-w-0 max-w-full overflow-hidden break-words hyphens-auto", className)}
      {...props}
    >
      {children}
    </span>
  );
}