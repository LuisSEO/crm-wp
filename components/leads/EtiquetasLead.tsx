"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorApiCliente, llamarApi } from "@/lib/cliente-api";
import type { Etiqueta } from "@/lib/datos";

/** Todas las etiquetas del catálogo como interruptores: pulsar una la pone o la quita del lead. */
export function EtiquetasLead({
  leadId,
  seleccionadas,
  catalogo,
}: {
  leadId: string;
  seleccionadas: string[];
  catalogo: Etiqueta[];
}) {
  const router = useRouter();
  const [ids, setIds] = useState(seleccionadas);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function alternar(id: string) {
    const anteriores = ids;
    const nuevas = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setIds(nuevas);
    setGuardando(true);
    setError(null);
    try {
      await llamarApi(`/api/leads/${leadId}/etiquetas`, "PUT", { etiquetas: nuevas });
      router.refresh();
    } catch (e) {
      setIds(anteriores);
      setError(e instanceof ErrorApiCliente ? e.message : "No se pudieron guardar las etiquetas.");
    } finally {
      setGuardando(false);
    }
  }

  if (catalogo.length === 0) {
    return (
      <p className="mt-4 text-muted">
        Aún no hay etiquetas. Créalas en el apartado{" "}
        <Link href="/etiquetas" className="underline underline-offset-4">
          Etiquetas
        </Link>
        .
      </p>
    );
  }

  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-2">
        {catalogo.map((e) => {
          const activa = ids.includes(e.id);
          return (
            <li key={e.id}>
              <button
                type="button"
                aria-pressed={activa}
                disabled={guardando}
                onClick={() => alternar(e.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption text-ink transition-opacity disabled:cursor-wait ${
                  activa ? "" : "border-hairline-strong bg-transparent opacity-60 hover:opacity-100"
                }`}
                style={
                  activa
                    ? {
                        backgroundColor: `color-mix(in srgb, ${e.color} 14%, white)`,
                        borderColor: `color-mix(in srgb, ${e.color} 45%, white)`,
                      }
                    : undefined
                }
              >
                <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: e.color }} />
                {e.nombre}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-caption text-muted">Pulsa una etiqueta para ponerla o quitarla.</p>
      {error && (
        <p role="alert" className="mt-2 text-caption text-error">
          {error}
        </p>
      )}
    </>
  );
}
