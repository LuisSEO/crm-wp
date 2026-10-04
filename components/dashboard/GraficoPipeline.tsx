import { Tarjeta } from "@/components/ui/Tarjeta";
import { ETIQUETA_FASE } from "@/lib/constantes";
import type { Metricas } from "@/lib/datos";
import { formatearEuros } from "@/lib/formato";

/** Barras horizontales: valor en euros por fase. Los valores se leen como texto, las barras son solo apoyo visual. */
export function GraficoPipeline({ porFase }: { porFase: Metricas["porFase"] }) {
  const maximo = Math.max(...porFase.map((f) => f.valor), 1);

  return (
    <Tarjeta>
      <h2 className="text-display-sm text-ink">Pipeline por fase</h2>
      <p className="mt-1 text-caption text-muted">Valor en euros de las oportunidades de cada fase.</p>
      <ul className="mt-6 space-y-5">
        {porFase.map(({ fase, cantidad, valor }) => (
          <li key={fase}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-body-strong text-ink">{ETIQUETA_FASE[fase]}</span>
              <span className="text-caption text-muted">
                {cantidad} {cantidad === 1 ? "oportunidad" : "oportunidades"} ·{" "}
                <span className="font-medium text-ink">{formatearEuros(valor)}</span>
              </span>
            </div>
            <div aria-hidden className="mt-2 h-2 overflow-hidden rounded-full bg-surface-strong">
              <div
                className={`h-full rounded-full ${fase === "perdida" ? "bg-muted-soft" : "bg-primary"}`}
                style={{ width: `${valor > 0 ? Math.max((valor / maximo) * 100, 2) : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}
