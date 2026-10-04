import { Tarjeta } from "@/components/ui/Tarjeta";
import { ETIQUETA_ESTADO, ESTADOS } from "@/lib/constantes";
import type { Metricas } from "@/lib/datos";
import { formatearEuros } from "@/lib/formato";

function Metrica({ nombre, valor, detalle }: { nombre: string; valor: string; detalle: string }) {
  return (
    <Tarjeta>
      <p className="text-caption-uppercase text-muted">{nombre}</p>
      <p className="mt-3 text-display-lg text-ink">{valor}</p>
      <p className="mt-2 text-caption text-muted">{detalle}</p>
    </Tarjeta>
  );
}

export function TarjetasMetricas({ metricas }: { metricas: Metricas }) {
  const abiertas = metricas.porFase
    .filter((f) => f.fase === "contactado" || f.fase === "propuesta" || f.fase === "negociacion")
    .reduce((suma, f) => suma + f.cantidad, 0);
  const ganadas = metricas.porFase.find((f) => f.fase === "ganada")?.cantidad ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metrica
        nombre="Leads"
        valor={String(metricas.totalLeads)}
        detalle={ESTADOS.map((e) => `${metricas.leadsPorEstado[e]} ${ETIQUETA_ESTADO[e].toLowerCase()}`).join(" · ")}
      />
      <Metrica
        nombre="Valor del pipeline"
        valor={formatearEuros(metricas.valorPipelineAbierto)}
        detalle={abiertas === 1 ? "1 oportunidad abierta" : `${abiertas} oportunidades abiertas`}
      />
      <Metrica
        nombre="Valor ganado"
        valor={formatearEuros(metricas.valorGanado)}
        detalle={ganadas === 1 ? "1 oportunidad ganada" : `${ganadas} oportunidades ganadas`}
      />
      <Metrica
        nombre="Oportunidades"
        valor={String(metricas.porFase.reduce((suma, f) => suma + f.cantidad, 0))}
        detalle="En todas las fases"
      />
    </div>
  );
}
