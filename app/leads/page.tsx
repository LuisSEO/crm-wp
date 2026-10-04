import { CabeceraPagina } from "@/components/CabeceraPagina";
import { FormularioLead } from "@/components/leads/FormularioLead";
import { FiltrosLeads } from "@/components/leads/FiltrosLeads";
import { ListaLeads } from "@/components/leads/ListaLeads";
import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { obtenerCatalogoEtiquetas, obtenerLeads } from "@/lib/datos";

export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;

const texto = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function Leads({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const filtros = { q: texto(params.q), estado: texto(params.estado), etiqueta: texto(params.etiqueta) };
  const hayFiltros = Boolean(filtros.q || filtros.estado || filtros.etiqueta);

  const [leads, etiquetas] = await Promise.all([obtenerLeads(filtros), obtenerCatalogoEtiquetas()]);

  return (
    <div className="space-y-8">
      <CabeceraPagina
        etiqueta="Leads"
        titulo="Tus clientes potenciales"
        descripcion="Busca, filtra y abre la ficha de cada lead."
        color="mint"
        acciones={<FormularioLead />}
      />

      <FiltrosLeads filtros={filtros} etiquetas={etiquetas} />

      <p className="text-caption text-muted" aria-live="polite">
        {leads.length === 1 ? "1 lead" : `${leads.length} leads`}
        {hayFiltros ? " con estos filtros" : ""}
      </p>

      {leads.length > 0 ? (
        <ListaLeads leads={leads} />
      ) : (
        <EstadoVacio
          titulo={hayFiltros ? "Ningún lead coincide" : "Todavía no hay leads"}
          texto={
            hayFiltros
              ? "Prueba con otra búsqueda o quita algún filtro para ver más resultados."
              : "Crea tu primer lead con el botón «Nuevo lead» y aparecerá aquí."
          }
          accion={hayFiltros ? <Boton href="/leads" variante="contorno">Limpiar filtros</Boton> : undefined}
        />
      )}
    </div>
  );
}
