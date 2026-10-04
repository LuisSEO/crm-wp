"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { abierto: boolean; alCerrar: () => void; titulo: string; children: ReactNode };

/** Ventana modal con el <dialog> nativo: se cierra con Escape, devuelve el foco y bloquea lo de detrás. */
export function Dialogo({ abierto, alCerrar, titulo, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      aria-labelledby="titulo-dialogo"
      className="m-auto max-h-[90vh] w-[min(34rem,calc(100%-2rem))] overflow-y-auto rounded-xl border border-hairline bg-surface-card p-0 text-ink shadow-soft backdrop:bg-ink/40"
    >
      {abierto && (
        <div className="p-6 sm:p-8">
          <h2 id="titulo-dialogo" className="text-display-sm text-ink">
            {titulo}
          </h2>
          <div className="mt-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}
