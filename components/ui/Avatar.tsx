import { iniciales } from "@/lib/formato";

/** Círculo de 32 px con las iniciales del nombre. */
export function Avatar({ nombre }: { nombre: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-strong text-caption-uppercase text-ink"
    >
      {iniciales(nombre)}
    </span>
  );
}
