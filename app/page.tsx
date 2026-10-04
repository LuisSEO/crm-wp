import { CabeceraPagina } from "@/components/CabeceraPagina";
import { GraficoPipeline } from "@/components/dashboard/GraficoPipeline";
import { LeadsRecientes } from "@/components/dashboard/LeadsRecientes";
import { ProximosCierres } from "@/components/dashboard/ProximosCierres";
import { TarjetasMetricas } from "@/components/dashboard/TarjetasMetricas";
import { obtenerMetricas } from "@/lib/datos";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const metricas = await obtenerMetricas();

  return (
    <div className="space-y-8">
      <CabeceraPagina
        etiqueta="Dashboard"
        titulo="Tu pipeline de un vistazo"
        descripcion="Las métricas clave de tus leads y oportunidades, en un solo lugar."
        color="lavender"
      />

      <TarjetasMetricas metricas={metricas} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GraficoPipeline porFase={metricas.porFase} />
        <ProximosCierres oportunidades={metricas.proximosCierres} />
      </div>

      <LeadsRecientes leads={metricas.recientes} />
    </div>
  );
}
