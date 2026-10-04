import { leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { obtenerOportunidades } from "@/lib/datos";
import { crearOportunidad } from "@/lib/escritura";
import { oportunidadNueva } from "@/lib/validacion";

export const dynamic = "force-dynamic";

export function GET() {
  return manejar(async () => respuestaOk(await obtenerOportunidades()));
}

export function POST(peticion: Request) {
  return manejar(async () => {
    const datos = validar(oportunidadNueva, await leerJson(peticion));
    return respuestaOk(await crearOportunidad(datos), 201);
  });
}
