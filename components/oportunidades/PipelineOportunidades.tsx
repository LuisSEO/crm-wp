"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TarjetaOportunidad } from "@/components/oportunidades/TarjetaOportunidad";
import { ErrorApiCliente, llamarApi } from "@/lib/cliente-api";
import { ETIQUETA_FASE, FASES, type Fase } from "@/lib/constantes";
import type { OportunidadConLead } from "@/lib/datos";
import { formatearEuros } from "@/lib/formato";

const punto: Record<string, string> = {
  ganada: "bg-success",
  perdida: "bg-error",
};

/**
 * Tablero por fases. En móvil se desliza en horizontal; en escritorio, cinco columnas.
 * Una oportunidad se mueve arrastrándola a otra columna o con el selector de su tarjeta (teclado y móvil).
 * El cambio se ve al instante y, si la API falla, la tarjeta vuelve a su sitio con un aviso.
 */
export function PipelineOportunidades({ oportunidades }: { oportunidades: OportunidadConLead[] }) {
  // La clave cambia cuando cambian los datos del servidor, así el estado local se reinicia con ellos.
  const firma = oportunidades.map((o) => `${o.id}:${o.fase}:${o.valor}`).join("|");
  return <Tablero key={firma} inicial={oportunidades} />;
}

function Tablero({ inicial }: { inicial: OportunidadConLead[] }) {
  const router = useRouter();
  const [lista, setLista] = useState(inicial);
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [columnaSobre, setColumnaSobre] = useState<Fase | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function mover(id: string, fase: Fase) {
    const actual = lista.find((o) => o.id === id);
    if (!actual || actual.fase === fase) return;

    const anterior = lista;
    setAviso(null);
    setLista(lista.map((o) => (o.id === id ? { ...o, fase } : o)));
    try {
      await llamarApi(`/api/oportunidades/${id}`, "PATCH", { fase });
      router.refresh();
    } catch (e) {
      setLista(anterior);
      setAviso(
        `${e instanceof ErrorApiCliente ? e.message : "No se pudo mover la oportunidad."} La tarjeta ha vuelto a su fase.`,
      );
    }
  }

  return (
    <div className="space-y-4">
      <p role="status" aria-live="polite" className={aviso ? "text-caption text-error" : "sr-only"}>
        {aviso ?? ""}
      </p>
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {FASES.map((fase) => {
          const deLaFase = lista.filter((o) => o.fase === fase);
          const total = deLaFase.reduce((suma, o) => suma + o.valor, 0);
          const sobre = columnaSobre === fase && arrastrando !== null;
          return (
            <section
              key={fase}
              aria-labelledby={`fase-${fase}`}
              onDragOver={(e) => {
                if (!arrastrando) return;
                e.preventDefault();
                setColumnaSobre(fase);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setColumnaSobre(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                setArrastrando(null);
                setColumnaSobre(null);
                if (id) void mover(id, fase);
              }}
              className={`w-72 shrink-0 snap-start rounded-xl p-3 transition-colors lg:w-auto ${
                sobre ? "bg-surface-strong outline-2 -outline-offset-2 outline-ink" : "bg-canvas-soft"
              }`}
            >
              <header className="px-1 pb-3 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 id={`fase-${fase}`} className="flex items-center gap-2 text-title-sm text-ink">
                    <span aria-hidden className={`size-2 rounded-full ${punto[fase] ?? "bg-muted-soft"}`} />
                    {ETIQUETA_FASE[fase]}
                  </h2>
                  <span className="rounded-full bg-surface-strong px-2 py-0.5 text-caption text-ink">
                    {deLaFase.length}
                  </span>
                </div>
                <p className="mt-1 text-caption text-muted">{formatearEuros(total)}</p>
              </header>

              {deLaFase.length > 0 ? (
                <ul className="space-y-3">
                  {deLaFase.map((o) => (
                    <li key={o.id}>
                      <TarjetaOportunidad
                        oportunidad={o}
                        arrastrando={arrastrando === o.id}
                        alEmpezarArrastre={() => setArrastrando(o.id)}
                        alTerminarArrastre={() => {
                          setArrastrando(null);
                          setColumnaSobre(null);
                        }}
                        alCambiarFase={(nueva) => void mover(o.id, nueva)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed border-hairline-strong px-3 py-6 text-center text-caption text-muted">
                  Sin oportunidades en esta fase
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
