import Link from "next/link";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";
import { Selector } from "@/components/ui/Selector";
import { ESTADOS, ETIQUETA_ESTADO } from "@/lib/constantes";
import type { Etiqueta, FiltrosLeads as Filtros } from "@/lib/datos";

/**
 * Buscador y filtros. Es un formulario GET normal: al enviarlo, los filtros quedan en la URL
 * (/leads?q=ana&estado=nuevo), así se pueden recargar y compartir.
 */
export function FiltrosLeads({ filtros, etiquetas }: { filtros: Filtros; etiquetas: Etiqueta[] }) {
  const hayFiltros = Boolean(filtros.q || filtros.estado || filtros.etiqueta);

  return (
    <form method="get" action="/leads" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
      <Campo
        etiqueta="Buscar"
        name="q"
        type="search"
        defaultValue={filtros.q ?? ""}
        placeholder="Nombre, email o empresa"
      />
      <Selector
        etiqueta="Estado"
        name="estado"
        vacio="Todos los estados"
        defaultValue={filtros.estado ?? ""}
        opciones={ESTADOS.map((e) => ({ valor: e, texto: ETIQUETA_ESTADO[e] }))}
      />
      <Selector
        etiqueta="Etiqueta"
        name="etiqueta"
        vacio="Todas las etiquetas"
        defaultValue={filtros.etiqueta ?? ""}
        opciones={etiquetas.map((e) => ({ valor: e.id, texto: e.nombre }))}
      />
      <div className="flex items-end gap-3">
        <Boton type="submit">Filtrar</Boton>
        {hayFiltros && (
          <Link href="/leads" className="flex h-10 items-center text-[15px] font-medium text-ink underline-offset-4 hover:underline">
            Limpiar
          </Link>
        )}
      </div>
    </form>
  );
}
