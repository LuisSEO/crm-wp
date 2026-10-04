import Link from "next/link";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { NuevaEtiqueta } from "@/components/etiquetas/NuevaEtiqueta";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { obtenerEtiquetas } from "@/lib/datos";

export const dynamic = "force-dynamic";

export default async function Etiquetas() {
  const etiquetas = await obtenerEtiquetas();

  return (
    <div className="space-y-8">
      <CabeceraPagina
        etiqueta="Etiquetas"
        titulo="Cómo clasificas tus leads"
        descripcion="El catálogo de etiquetas con su color y los leads que lleva cada una."
        color="rose"
        acciones={<NuevaEtiqueta />}
      />

      {etiquetas.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {etiquetas.map((e) => (
            <li key={e.id}>
              <Link href={`/leads?etiqueta=${e.id}`} className="block rounded-xl">
                <Tarjeta interactiva>
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden
                      className="size-10 shrink-0 rounded-full border border-hairline"
                      style={{ backgroundColor: e.color }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-title-md text-ink">{e.nombre}</p>
                      <p className="text-caption text-muted">
                        {e.totalLeads === 1 ? "1 lead" : `${e.totalLeads} leads`} · {e.color}
                      </p>
                    </div>
                  </div>
                </Tarjeta>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVacio
          titulo="Todavía no hay etiquetas"
          texto="Las etiquetas te ayudan a clasificar tus leads, por ejemplo como cliente VIP o contacto frío."
        />
      )}
    </div>
  );
}
