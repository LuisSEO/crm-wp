import { EtiquetasLead } from "@/components/leads/EtiquetasLead";
import { NuevaNota } from "@/components/leads/NuevaNota";
import { NuevaOportunidad } from "@/components/oportunidades/NuevaOportunidad";
import { Insignia } from "@/components/ui/Insignia";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { ETIQUETA_FASE, type Fase } from "@/lib/constantes";
import type { Etiqueta, FichaDeLead } from "@/lib/datos";
import { formatearEuros, formatearFecha } from "@/lib/formato";

function Dato({ nombre, children }: { nombre: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-caption-uppercase text-muted">{nombre}</dt>
      <dd className="mt-1 break-words text-ink">{children}</dd>
    </div>
  );
}

const sinDato = <span className="text-muted-soft">Sin indicar</span>;

export function FichaLead({ ficha, catalogoEtiquetas }: { ficha: FichaDeLead; catalogoEtiquetas: Etiqueta[] }) {
  const { lead, oportunidades, notas } = ficha;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6">
        <Tarjeta>
          <h2 className="text-display-sm text-ink">Datos de contacto</h2>
          <dl className="mt-5 space-y-4">
            <Dato nombre="Email">
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="underline underline-offset-4">
                  {lead.email}
                </a>
              ) : (
                sinDato
              )}
            </Dato>
            <Dato nombre="Teléfono">
              {lead.telefono ? (
                <a href={`tel:${lead.telefono.replace(/\s+/g, "")}`} className="underline underline-offset-4">
                  {lead.telefono}
                </a>
              ) : (
                sinDato
              )}
            </Dato>
            <Dato nombre="Empresa">{lead.empresa ?? sinDato}</Dato>
            <Dato nombre="Origen">{lead.origen ?? sinDato}</Dato>
            <Dato nombre="Alta">{formatearFecha(lead.created_at)}</Dato>
          </dl>
        </Tarjeta>

        <Tarjeta>
          <h2 className="text-display-sm text-ink">Etiquetas</h2>
          <EtiquetasLead leadId={lead.id} seleccionadas={lead.etiquetas.map((e) => e.id)} catalogo={catalogoEtiquetas} />
        </Tarjeta>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <Tarjeta>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-display-sm text-ink">Oportunidades</h2>
            <NuevaOportunidad leadId={lead.id} />
          </div>
          {oportunidades.length > 0 ? (
            <ul className="mt-4 divide-y divide-hairline">
              {oportunidades.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
                  <div className="min-w-0">
                    <p className="text-body-strong text-ink">{o.titulo}</p>
                    <p className="text-caption text-muted">Cierre estimado: {formatearFecha(o.cierre_estimado)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Insignia>{ETIQUETA_FASE[o.fase as Fase] ?? o.fase}</Insignia>
                    <span className="w-24 text-right text-body-strong text-ink">{formatearEuros(o.valor)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-muted">Este lead no tiene oportunidades abiertas.</p>
          )}
        </Tarjeta>

        <Tarjeta>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-display-sm text-ink">Notas</h2>
            <NuevaNota leadId={lead.id} />
          </div>
          {notas.length > 0 ? (
            <ul className="mt-4 divide-y divide-hairline">
              {notas.map((n) => (
                <li key={n.id} className="py-4">
                  <p className="whitespace-pre-line text-ink">{n.texto}</p>
                  <p className="mt-1 text-caption text-muted">{formatearFecha(n.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-muted">Todavía no hay notas de seguimiento.</p>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}
