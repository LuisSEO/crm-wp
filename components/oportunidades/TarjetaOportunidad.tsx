"use client";

import Link from "next/link";
import { ETIQUETA_FASE, FASES, type Fase } from "@/lib/constantes";
import type { OportunidadConLead } from "@/lib/datos";
import { formatearEuros, formatearFecha } from "@/lib/formato";

type Props = {
  oportunidad: OportunidadConLead;
  arrastrando: boolean;
  alEmpezarArrastre: () => void;
  alTerminarArrastre: () => void;
  alCambiarFase: (fase: Fase) => void;
};

/** Tarjeta del pipeline: se arrastra a otra columna o se cambia de fase con su selector. */
export function TarjetaOportunidad({
  oportunidad,
  arrastrando,
  alEmpezarArrastre,
  alTerminarArrastre,
  alCambiarFase,
}: Props) {
  const { id, titulo, valor, fase, cierre_estimado, lead } = oportunidad;
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
        alEmpezarArrastre();
      }}
      onDragEnd={alTerminarArrastre}
      className={`cursor-grab rounded-lg border border-hairline bg-surface-card p-4 transition-shadow hover:shadow-soft active:cursor-grabbing ${
        arrastrando ? "opacity-40" : ""
      }`}
    >
      <h3 className="text-body-strong text-ink">{titulo}</h3>
      {lead && (
        <p className="mt-1 text-caption text-muted">
          <Link href={`/leads/${lead.id}`} className="underline-offset-4 hover:text-ink hover:underline">
            {lead.nombre}
          </Link>
          {lead.empresa ? ` · ${lead.empresa}` : ""}
        </p>
      )}
      <p className="mt-3 text-title-sm text-ink">{formatearEuros(valor)}</p>
      <p className="mt-1 text-caption text-muted">Cierre: {formatearFecha(cierre_estimado)}</p>
      <label className="mt-3 block">
        <span className="sr-only">Fase de «{titulo}»</span>
        <select
          value={fase}
          onChange={(e) => alCambiarFase(e.target.value as Fase)}
          className="h-9 w-full rounded-md border border-hairline-strong bg-surface-card px-2 text-caption text-ink focus:border-ink focus:outline-none"
        >
          {FASES.map((f) => (
            <option key={f} value={f}>
              {ETIQUETA_FASE[f]}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}
