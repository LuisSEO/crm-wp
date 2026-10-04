import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { EtiquetaColor } from "@/components/ui/EtiquetaColor";
import { Insignia } from "@/components/ui/Insignia";
import { ETIQUETA_ESTADO, type Estado } from "@/lib/constantes";
import type { Etiqueta, Lead } from "@/lib/datos";
import { formatearFecha } from "@/lib/formato";

/** Fila de lead: avatar, nombre y empresa, etiquetas, estado y fecha de alta. Todo el renglón es un enlace a la ficha. */
export function FilaLead({ lead, etiquetas = [] }: { lead: Lead; etiquetas?: Etiqueta[] }) {
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-canvas-soft sm:px-6"
    >
      <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
        <Avatar nombre={lead.nombre} />
        <div className="min-w-0">
          <p className="truncate text-body-strong text-ink">{lead.nombre}</p>
          <p className="truncate text-caption text-muted">{lead.empresa ?? "Sin empresa"}</p>
        </div>
      </div>

      {etiquetas.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Etiquetas">
          {etiquetas.map((e) => (
            <li key={e.id}>
              <EtiquetaColor nombre={e.nombre} color={e.color} />
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-4">
        <Insignia>{ETIQUETA_ESTADO[lead.estado as Estado] ?? lead.estado}</Insignia>
        <span className="w-24 text-right text-caption text-muted">{formatearFecha(lead.created_at)}</span>
      </div>
    </Link>
  );
}
