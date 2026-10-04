"use client";

import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/EstadoVacio";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EstadoVacio
      titulo="No hemos podido cargar los datos"
      texto="Falló la conexión con la base de datos. Comprueba que las claves del archivo .env son correctas e inténtalo de nuevo."
      accion={<Boton onClick={reset}>Reintentar</Boton>}
    />
  );
}
