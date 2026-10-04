import type { ReactNode } from "react";

/** Insignia en píldora (estados, contadores). Texto en mayúsculas pequeñas. */
export function Insignia({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-surface-strong px-2.5 py-1 text-caption-uppercase text-ink ${className}`}
    >
      {children}
    </span>
  );
}
