import Link from "next/link";
import { Insignia } from "@/components/ui/Insignia";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { ETIQUETA_FASE, type Fase } from "@/lib/constantes";
import type { OportunidadConLead } from "@/lib/datos";
import { formatearEuros, formatearFecha } from "@/lib/formato";

export function ProximosCierres({ oportunidades }: { oportunidades: OportunidadConLead[] }) {
  return (
    <Tarjeta>
      <h2 className="text-display-sm text-ink">Próximos cierres</h2>
      <p className="mt-1 text-caption text-muted">Oportunidades abiertas, por fecha de cierre estimado.</p>
      {oportunidades.length > 0 ? (
        <ul className="mt-4 divide-y divide-hairline">
          {oportunidades.map((o) => (
            <li key={o.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-body-strong text-ink">{o.titulo}</p>
                  {o.lead && (
                    <Link href={`/leads/${o.lead.id}`} className="text-caption text-muted underline-offset-4 hover:underline">
                      {o.lead.nombre}
                    </Link>
                  )}
                </div>
                <span className="shrink-0 text-body-strong text-ink">{formatearEuros(o.valor)}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Insignia>{ETIQUETA_FASE[o.fase as Fase] ?? o.fase}</Insignia>
                <span className="text-caption text-muted">{formatearFecha(o.cierre_estimado)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted">No hay oportunidades abiertas con fecha de cierre.</p>
      )}
    </Tarjeta>
  );
}
