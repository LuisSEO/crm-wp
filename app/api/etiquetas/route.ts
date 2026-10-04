import { leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { obtenerEtiquetas } from "@/lib/datos";
import { crearEtiqueta } from "@/lib/escritura";
import { etiquetaNueva } from "@/lib/validacion";

export const dynamic = "force-dynamic";

export function GET() {
  return manejar(async () => respuestaOk(await obtenerEtiquetas()));
}

export function POST(peticion: Request) {
  return manejar(async () => {
    const datos = validar(etiquetaNueva, await leerJson(peticion));
    return respuestaOk(await crearEtiqueta(datos), 201);
  });
}
