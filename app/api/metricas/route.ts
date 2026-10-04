import { manejar, respuestaOk } from "@/lib/api";
import { obtenerMetricas } from "@/lib/datos";

export const dynamic = "force-dynamic";

export function GET() {
  return manejar(async () => respuestaOk(await obtenerMetricas()));
}
