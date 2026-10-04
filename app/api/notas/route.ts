import { ErrorApi, leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { obtenerNotasDeLead } from "@/lib/datos";
import { crearNota } from "@/lib/escritura";
import { id, notaNueva } from "@/lib/validacion";

export const dynamic = "force-dynamic";

/** Notas de un lead: /api/notas?lead=<id> */
export function GET(peticion: Request) {
  return manejar(async () => {
    const lead = id.safeParse(new URL(peticion.url).searchParams.get("lead"));
    if (!lead.success) throw new ErrorApi(400, "Indica el lead con ?lead=<id>.", { lead: "Falta un lead válido." });
    return respuestaOk(await obtenerNotasDeLead(lead.data));
  });
}

export function POST(peticion: Request) {
  return manejar(async () => {
    const datos = validar(notaNueva, await leerJson(peticion));
    return respuestaOk(await crearNota(datos), 201);
  });
}
