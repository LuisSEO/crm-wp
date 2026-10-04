import { idDeRuta, leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { fijarEtiquetasDeLead } from "@/lib/escritura";
import { etiquetasDeLead } from "@/lib/validacion";

export const dynamic = "force-dynamic";

/** Cuerpo: { "etiquetas": ["<id>", ...] }. El lead queda con exactamente esas etiquetas. */
export function PUT(peticion: Request, { params }: { params: Promise<{ id: string }> }) {
  return manejar(async () => {
    const id = idDeRuta((await params).id, "El lead");
    const { etiquetas } = validar(etiquetasDeLead, await leerJson(peticion));
    return respuestaOk(await fijarEtiquetasDeLead(id, etiquetas));
  });
}
