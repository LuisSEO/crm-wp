import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/EstadoVacio";

export default function NoEncontrada() {
  return (
    <EstadoVacio
      titulo="Esta página no existe"
      texto="Revisa la dirección o vuelve al dashboard."
      accion={<Boton href="/">Ir al dashboard</Boton>}
    />
  );
}
