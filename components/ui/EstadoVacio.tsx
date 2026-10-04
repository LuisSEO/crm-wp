import type { ReactNode } from "react";

/** Mensaje para pantallas o listas sin contenido: dice qué pasa y qué hacer. */
export function EstadoVacio({ titulo, texto, accion }: { titulo: string; texto: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-hairline-strong px-6 py-14 text-center">
      <h2 className="text-display-sm text-ink">{titulo}</h2>
      <p className="mt-2 max-w-md text-muted">{texto}</p>
      {accion && <div className="mt-6">{accion}</div>}
    </div>
  );
}
