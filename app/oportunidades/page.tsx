import { CabeceraPagina } from "@/components/CabeceraPagina";
import { NuevaOportunidad } from "@/components/oportunidades/NuevaOportunidad";
import { PipelineOportunidades } from "@/components/oportunidades/PipelineOportunidades";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { obtenerOportunidades, obtenerResumenLeads } from "@/lib/datos";

export const dynamic = "force-dynamic";

export default async function Oportunidades() {
  const [oportunidades, leads] = await Promise.all([obtenerOportunidades(), obtenerResumenLeads()]);

  return (
    <div className="space-y-8">
      <CabeceraPagina
        etiqueta="Oportunidades"
        titulo="Pipeline de oportunidades"
        descripcion="Los negocios abiertos, organizados por fase. Arrastra una tarjeta a otra columna para cambiarla de fase."
        color="peach"
        acciones={<NuevaOportunidad leads={leads} />}
      />

      {oportunidades.length > 0 ? (
        <PipelineOportunidades oportunidades={oportunidades} />
      ) : (
        <EstadoVacio
          titulo="Todavía no hay oportunidades"
          texto="Crea una con el botón «Nueva oportunidad» y aparecerá en su fase del pipeline."
        />
      )}
    </div>
  );
}
