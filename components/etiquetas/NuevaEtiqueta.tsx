"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";
import { Dialogo } from "@/components/ui/Dialogo";
import { useEnvio } from "@/components/ui/useEnvio";
import { llamarApi } from "@/lib/cliente-api";

export function NuevaEtiqueta() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const { enviando, error, campos, enviar } = useEnvio();

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const creada = await enviar(() =>
      llamarApi("/api/etiquetas", "POST", { nombre: f.get("nombre"), color: f.get("color") }),
    );
    if (!creada) return;
    setAbierto(false);
    router.refresh();
  }

  return (
    <>
      <Boton onClick={() => setAbierto(true)}>Nueva etiqueta</Boton>
      <Dialogo abierto={abierto} alCerrar={() => setAbierto(false)} titulo="Nueva etiqueta">
        <form onSubmit={alEnviar} className="space-y-4" noValidate>
          <Campo
            etiqueta="Nombre"
            name="nombre"
            placeholder="Cliente VIP, Contacto frío…"
            error={campos.nombre}
            autoFocus
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="color-etiqueta" className="text-caption font-medium text-ink">
              Color
            </label>
            <input
              id="color-etiqueta"
              name="color"
              type="color"
              defaultValue="#3b82f6"
              className="h-11 w-24 cursor-pointer rounded-md border border-hairline-strong bg-surface-card p-1"
            />
            {campos.color && <p className="text-caption text-error">{campos.color}</p>}
          </div>
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
              {enviando ? "Guardando…" : "Crear etiqueta"}
            </Boton>
          </div>
        </form>
      </Dialogo>
    </>
  );
}
