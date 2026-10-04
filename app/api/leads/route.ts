import { leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { obtenerLeads } from "@/lib/datos";
import { crearLead } from "@/lib/escritura";
import { leadNuevo } from "@/lib/validacion";

export const dynamic = "force-dynamic";

/** Lista con búsqueda y filtros: /api/leads?q=ana&estado=nuevo&etiqueta=<id> */
export function GET(peticion: Request) {
  return manejar(async () => {
    const p = new URL(peticion.url).searchParams;
    const leads = await obtenerLeads({
      q: p.get("q") ?? undefined,
      estado: p.get("estado") ?? undefined,
      etiqueta: p.get("etiqueta") ?? undefined,
    });
    return respuestaOk(leads);
  });
}

export function POST(peticion: Request) {
  return manejar(async () => {
    const datos = validar(leadNuevo, await leerJson(peticion));
    return respuestaOk(await crearLead(datos), 201);
  });
}
