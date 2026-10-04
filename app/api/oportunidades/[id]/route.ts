import { idDeRuta, leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { editarOportunidad } from "@/lib/escritura";
import { oportunidadEdicion } from "@/lib/validacion";

export const dynamic = "force-dynamic";

/** Cambia fase, valor, título o cierre estimado. Mover de fase: { "fase": "ganada" }. */
export function PATCH(peticion: Request, { params }: { params: Promise<{ id: string }> }) {
  return manejar(async () => {
    const id = idDeRuta((await params).id, "La oportunidad");
    const cambios = validar(oportunidadEdicion, await leerJson(peticion));
    return respuestaOk(await editarOportunidad(id, cambios));
  });
}
