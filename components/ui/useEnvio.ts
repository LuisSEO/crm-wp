"use client";

import { useState } from "react";
import { ErrorApiCliente } from "@/lib/cliente-api";

/** Estado de un formulario que se envía a la API: "guardando", error general y error de cada campo. */
export function useEnvio() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campos, setCampos] = useState<Record<string, string>>({});

  async function enviar<T>(accion: () => Promise<T>): Promise<T | undefined> {
    setEnviando(true);
    setError(null);
    setCampos({});
    try {
      return await accion();
    } catch (e) {
      if (e instanceof ErrorApiCliente) {
        setCampos(e.campos);
        // Si el fallo ya se ve junto a un campo, no hace falta repetirlo arriba.
        setError(Object.keys(e.campos).length > 0 ? null : e.message);
      } else {
        setError("No se pudo completar la acción. Inténtalo de nuevo.");
      }
      return undefined;
    } finally {
      setEnviando(false);
    }
  }

  return { enviando, error, campos, enviar };
}
