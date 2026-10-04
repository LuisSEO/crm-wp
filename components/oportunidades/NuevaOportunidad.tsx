"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";
import { Dialogo } from "@/components/ui/Dialogo";
import { Selector } from "@/components/ui/Selector";
import { useEnvio } from "@/components/ui/useEnvio";
import { llamarApi } from "@/lib/cliente-api";
import { ETIQUETA_FASE, FASES } from "@/lib/constantes";
import type { LeadResumen } from "@/lib/datos";

/** Con `leadId` (desde la ficha) la oportunidad va a ese lead; con `leads` (desde el pipeline) se elige el lead. */
export function NuevaOportunidad({ leadId, leads }: { leadId?: string; leads?: LeadResumen[] }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const { enviando, error, campos, enviar } = useEnvio();

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const valorTexto = String(f.get("valor") ?? "").trim().replace(",", ".");
    const cuerpo = {
      lead_id: leadId ?? f.get("lead_id"),
      titulo: f.get("titulo"),
      valor: valorTexto === "" ? 0 : Number(valorTexto),
      fase: f.get("fase"),
      cierre_estimado: f.get("cierre_estimado"),
    };
    const creada = await enviar(() => llamarApi("/api/oportunidades", "POST", cuerpo));
    if (!creada) return;
    setAbierto(false);
    router.refresh();
  }

  return (
    <>
      <Boton variante={leadId ? "contorno" : "primario"} onClick={() => setAbierto(true)}>
        Nueva oportunidad
      </Boton>
      <Dialogo abierto={abierto} alCerrar={() => setAbierto(false)} titulo="Nueva oportunidad">
        <form onSubmit={alEnviar} className="space-y-4" noValidate>
          {!leadId && (
            <Selector
              etiqueta="Lead"
              name="lead_id"
              vacio="Elige un lead"
              opciones={(leads ?? []).map((l) => ({
                valor: l.id,
                texto: l.empresa ? `${l.nombre} · ${l.empresa}` : l.nombre,
              }))}
              error={campos.lead_id}
            />
          )}
          <Campo
            etiqueta="Título"
            name="titulo"
            placeholder="Rediseño web, mantenimiento anual…"
            error={campos.titulo}
            autoFocus
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Valor (€)" name="valor" inputMode="decimal" defaultValue="0" error={campos.valor} />
            <Campo etiqueta="Cierre estimado" name="cierre_estimado" type="date" error={campos.cierre_estimado} />
          </div>
          <Selector
            etiqueta="Fase"
            name="fase"
            defaultValue="contactado"
            opciones={FASES.map((f) => ({ valor: f, texto: ETIQUETA_FASE[f] }))}
            error={campos.fase}
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
              {enviando ? "Guardando…" : "Crear oportunidad"}
            </Boton>
          </div>
        </form>
      </Dialogo>
    </>
  );
}
