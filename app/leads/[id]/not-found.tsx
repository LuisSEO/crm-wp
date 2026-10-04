import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/EstadoVacio";

export default function LeadNoEncontrado() {
  return (
    <EstadoVacio
      titulo="No encontramos este lead"
      texto="Puede que el enlace sea incorrecto o que el lead ya no exista."
      accion={<Boton href="/leads">Volver a leads</Boton>}
    />
  );
}
