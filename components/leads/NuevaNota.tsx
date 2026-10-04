"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AreaTexto } from "@/components/ui/AreaTexto";
import { Boton } from "@/components/ui/Boton";
import { Dialogo } from "@/components/ui/Dialogo";
import { useEnvio } from "@/components/ui/useEnvio";
import { llamarApi } from "@/lib/cliente-api";

export function NuevaNota({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const { enviando, error, campos, enviar } = useEnvio();

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const texto = new FormData(e.currentTarget).get("texto");
    const guardada = await enviar(() => llamarApi("/api/notas", "POST", { lead_id: leadId, texto }));
    if (!guardada) return;
    setAbierto(false);
    router.refresh();
  }

  return (
    <>
      <Boton variante="contorno" onClick={() => setAbierto(true)}>
        Añadir nota
      </Boton>
      <Dialogo abierto={abierto} alCerrar={() => setAbierto(false)} titulo="Nueva nota">
        <form onSubmit={alEnviar} className="space-y-4" noValidate>
          <AreaTexto
            etiqueta="Nota"
            name="texto"
            placeholder="Qué se habló, qué toca hacer después…"
            error={campos.texto}
            autoFocus
          />
          {(error || campos.lead_id) && (
            <p role="alert" className="text-caption text-error">
              {error ?? campos.lead_id}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Boton type="button" variante="contorno" onClick={() => setAbierto(false)}>
              Cancelar
            </Boton>
            <Boton type="submit" disabled={enviando}>
              {enviando ? "Guardando…" : "Guardar nota"}
            </Boton>
          </div>
        </form>
      </Dialogo>
    </>
  );
}
