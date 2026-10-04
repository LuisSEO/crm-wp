import { ErrorApi, idDeRuta, leerJson, manejar, respuestaOk, validar } from "@/lib/api";
import { obtenerFichaLead } from "@/lib/datos";
import { editarLead } from "@/lib/escritura";
import { leadEdicion } from "@/lib/validacion";

export const dynamic = "force-dynamic";

type Contexto = { params: Promise<{ id: string }> };

export function GET(_peticion: Request, { params }: Contexto) {
  return manejar(async () => {
    const id = idDeRuta((await params).id, "El lead");
    const ficha = await obtenerFichaLead(id);
    if (!ficha) throw new ErrorApi(404, "El lead no existe.");
    return respuestaOk(ficha);
  });
}

export function PATCH(peticion: Request, { params }: Contexto) {
  return manejar(async () => {
    const id = idDeRuta((await params).id, "El lead");
    const cambios = validar(leadEdicion, await leerJson(peticion));
    return respuestaOk(await editarLead(id, cambios));
  });
}
