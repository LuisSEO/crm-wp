import "server-only";
import type { z } from "zod";
import { ErrorApi } from "./api";
import type { Etiqueta, Lead, Nota, Oportunidad } from "./datos";
import { crearClienteServidor } from "./supabase-servidor";
import type {
  etiquetaNueva,
  leadEdicion,
  leadNuevo,
  notaNueva,
  oportunidadEdicion,
  oportunidadNueva,
} from "./validacion";

/*
  TODA la escritura en la base de datos pasa por este archivo (las rutas de API solo validan y llaman aquí).
  Los datos ya llegan validados con los esquemas de lib/validacion.ts.
*/

type PgError = { code?: string; message: string };

const DUPLICADO = "23505";
const CLAVE_AJENA = "23503";

function esError(error: PgError | null, codigo: string) {
  return error?.code === codigo;
}

function fallo(error: PgError, contexto: string): never {
  throw new Error(`No se pudo ${contexto}: ${error.message}`);
}

export async function crearLead(datos: z.output<typeof leadNuevo>): Promise<Lead> {
  const { data, error } = await crearClienteServidor().from("leads").insert(datos).select().single();
  if (esError(error, DUPLICADO)) {
    throw new ErrorApi(409, "Ya existe un lead con ese email.", { email: "Ya existe un lead con ese email." });
  }
  if (error) fallo(error, "crear el lead");
  return data;
}

export async function editarLead(id: string, cambios: z.output<typeof leadEdicion>): Promise<Lead> {
  const { data, error } = await crearClienteServidor()
    .from("leads")
    .update(cambios)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (esError(error, DUPLICADO)) {
    throw new ErrorApi(409, "Ya existe otro lead con ese email.", { email: "Ya existe otro lead con ese email." });
  }
  if (error) fallo(error, "editar el lead");
  if (!data) throw new ErrorApi(404, "El lead no existe.");
  return data;
}

/** Deja al lead exactamente con las etiquetas indicadas: añade las nuevas y quita las que sobran. */
export async function fijarEtiquetasDeLead(leadId: string, etiquetaIds: string[]): Promise<Etiqueta[]> {
  const db = crearClienteServidor();
  const deseadas = [...new Set(etiquetaIds)];

  const lead = await db.from("leads").select("id").eq("id", leadId).maybeSingle();
  if (lead.error) fallo(lead.error, "leer el lead");
  if (!lead.data) throw new ErrorApi(404, "El lead no existe.");

  if (deseadas.length > 0) {
    const existentes = await db.from("etiquetas").select("id").in("id", deseadas);
    if (existentes.error) fallo(existentes.error, "leer las etiquetas");
    if ((existentes.data ?? []).length !== deseadas.length) {
      throw new ErrorApi(400, "Alguna de las etiquetas no existe.", { etiquetas: "Alguna de las etiquetas no existe." });
    }
  }

  const actuales = await db.from("lead_etiquetas").select("etiqueta_id").eq("lead_id", leadId);
  if (actuales.error) fallo(actuales.error, "leer las etiquetas del lead");
  const idsActuales = (actuales.data ?? []).map((f) => f.etiqueta_id);

  const aAnadir = deseadas.filter((e) => !idsActuales.includes(e));
  const aQuitar = idsActuales.filter((e) => !deseadas.includes(e));

  // Primero se añade y luego se quita: si algo falla a medias, nunca se pierde una etiqueta sin querer.
  if (aAnadir.length > 0) {
    const { error } = await db
      .from("lead_etiquetas")
      .upsert(aAnadir.map((etiqueta_id) => ({ lead_id: leadId, etiqueta_id })), { ignoreDuplicates: true });
    if (error) fallo(error, "añadir las etiquetas");
  }
  if (aQuitar.length > 0) {
    const { error } = await db.from("lead_etiquetas").delete().eq("lead_id", leadId).in("etiqueta_id", aQuitar);
    if (error) fallo(error, "quitar las etiquetas");
  }

  if (deseadas.length === 0) return [];
  const { data, error } = await db.from("etiquetas").select("*").in("id", deseadas).order("nombre");
  if (error) fallo(error, "leer las etiquetas del lead");
  return data ?? [];
}

export async function crearEtiqueta(datos: z.output<typeof etiquetaNueva>): Promise<Etiqueta> {
  const { data, error } = await crearClienteServidor().from("etiquetas").insert(datos).select().single();
  if (esError(error, DUPLICADO)) {
    throw new ErrorApi(409, "Ya existe una etiqueta con ese nombre.", { nombre: "Ya existe una etiqueta con ese nombre." });
  }
  if (error) fallo(error, "crear la etiqueta");
  return data;
}

export async function crearOportunidad(datos: z.output<typeof oportunidadNueva>): Promise<Oportunidad> {
  const { data, error } = await crearClienteServidor().from("oportunidades").insert(datos).select().single();
  if (esError(error, CLAVE_AJENA)) {
    throw new ErrorApi(400, "El lead indicado no existe.", { lead_id: "El lead indicado no existe." });
  }
  if (error) fallo(error, "crear la oportunidad");
  return data;
}

export async function editarOportunidad(id: string, cambios: z.output<typeof oportunidadEdicion>): Promise<Oportunidad> {
  const { data, error } = await crearClienteServidor()
    .from("oportunidades")
    .update(cambios)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) fallo(error, "editar la oportunidad");
  if (!data) throw new ErrorApi(404, "La oportunidad no existe.");
  return data;
}

export async function crearNota(datos: z.output<typeof notaNueva>): Promise<Nota> {
  const { data, error } = await crearClienteServidor().from("notas").insert(datos).select().single();
  if (esError(error, CLAVE_AJENA)) {
    throw new ErrorApi(400, "El lead indicado no existe.", { lead_id: "El lead indicado no existe." });
  }
  if (error) fallo(error, "crear la nota");
  return data;
}
