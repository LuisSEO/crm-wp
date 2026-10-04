"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";
import { Dialogo } from "@/components/ui/Dialogo";
import { Selector } from "@/components/ui/Selector";
import { useEnvio } from "@/components/ui/useEnvio";
import { llamarApi } from "@/lib/cliente-api";
import { ESTADOS, ETIQUETA_ESTADO } from "@/lib/constantes";
import type { Lead } from "@/lib/datos";

/**
 * Botón + ventana para crear un lead (sin `lead`) o editar el de la ficha (con `lead`).
 * Al crear, abre su ficha; al editar, refresca los datos de la página.
 */
export function FormularioLead({ lead }: { lead?: Lead }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const { enviando, error, campos, enviar } = useEnvio();

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const cuerpo = Object.fromEntries(
      ["nombre", "email", "telefono", "empresa", "origen", "estado"].map((k) => [k, f.get(k)]),
    );

    const guardado = await enviar(() =>
      lead ? llamarApi<Lead>(`/api/leads/${lead.id}`, "PATCH", cuerpo) : llamarApi<Lead>("/api/leads", "POST", cuerpo),
    );
    if (!guardado) return;
    setAbierto(false);
    if (lead) router.refresh();
    else router.push(`/leads/${guardado.id}`);
  }

  return (
    <>
      <Boton variante={lead ? "contorno" : "primario"} onClick={() => setAbierto(true)}>
        {lead ? "Editar lead" : "Nuevo lead"}
      </Boton>
      <Dialogo abierto={abierto} alCerrar={() => setAbierto(false)} titulo={lead ? "Editar lead" : "Nuevo lead"}>
        <form onSubmit={alEnviar} className="space-y-4" noValidate>
          <Campo etiqueta="Nombre" name="nombre" defaultValue={lead?.nombre} error={campos.nombre} autoFocus />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Email" name="email" type="email" defaultValue={lead?.email ?? ""} error={campos.email} />
            <Campo etiqueta="Teléfono" name="telefono" type="tel" defaultValue={lead?.telefono ?? ""} error={campos.telefono} />
            <Campo etiqueta="Empresa" name="empresa" defaultValue={lead?.empresa ?? ""} error={campos.empresa} />
            <Campo
              etiqueta="Origen"
              name="origen"
              defaultValue={lead?.origen ?? ""}
              placeholder="Web, referido, evento…"
              error={campos.origen}
            />
          </div>
          <Selector
            etiqueta="Estado"
            name="estado"
            defaultValue={lead?.estado ?? "nuevo"}
            opciones={ESTADOS.map((e) => ({ valor: e, texto: ETIQUETA_ESTADO[e] }))}
            error={campos.estado}
          />
          {error && (
            <p role="alert" className="text-caption text-error">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Boton type="button" variante="contorno" onClick={() => setAbierto(false)}>
              Cancelar
            </Boton>
            <Boton type="submit" disabled={enviando}>
              {enviando ? "Guardando…" : lead ? "Guardar cambios" : "Crear lead"}
            </Boton>
          </div>
        </form>
      </Dialogo>
    </>
  );
}
