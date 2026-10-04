import type { ReactNode } from "react";
import { Orbe } from "@/components/ui/Orbe";

type Props = {
  etiqueta: string;
  titulo: string;
  descripcion?: string;
  color?: "mint" | "peach" | "lavender" | "sky" | "rose";
  acciones?: ReactNode;
};

/** Cabecera editorial de cada apartado: etiqueta pequeña, titular serif y un orbe pastel de fondo. */
export function CabeceraPagina({ etiqueta, titulo, descripcion, color = "lavender", acciones }: Props) {
  return (
    <header className="relative overflow-hidden rounded-xxl bg-canvas-soft px-6 py-10 sm:px-10 sm:py-14">
      <Orbe color={color} className="-right-20 -top-28 size-80 sm:size-96" />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-caption-uppercase text-muted">{etiqueta}</p>
          <h1 className="mt-3 text-display-xl text-ink">{titulo}</h1>
          {descripcion && <p className="mt-4 text-muted">{descripcion}</p>}
        </div>
        {acciones && <div className="flex gap-3">{acciones}</div>}
      </div>
    </header>
  );
}
