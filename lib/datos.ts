import "server-only";
import { ESTADOS, FASES, FASES_ABIERTAS, type Estado, type Fase } from "./constantes";
import { crearClienteServidor } from "./supabase-servidor";
import type { Database } from "./tipos-bd";

/*
  TODA la lectura de datos de la app pasa por este archivo.
  En la fase 3 (backend) se sustituirá por llamadas a las rutas de API sin tocar las pantallas.
*/

type Tablas = Database["public"]["Tables"];
export type Lead = Tablas["leads"]["Row"];
export type Etiqueta = Tablas["etiquetas"]["Row"];
export type Oportunidad = Tablas["oportunidades"]["Row"];
export type Nota = Tablas["notas"]["Row"];

export type LeadConEtiquetas = Lead & { etiquetas: Etiqueta[] };
export type LeadResumen = Pick<Lead, "id" | "nombre" | "empresa">;
export type OportunidadConLead = Oportunidad & { lead: LeadResumen | null };
export type EtiquetaConTotal = Etiqueta & { totalLeads: number };

export type FichaDeLead = {
  lead: LeadConEtiquetas;
  oportunidades: Oportunidad[];
  notas: Nota[];
};

export type Metricas = {
  totalLeads: number;
  leadsPorEstado: Record<Estado, number>;
  porFase: { fase: Fase; cantidad: number; valor: number }[];
  valorPipelineAbierto: number;
  valorGanado: number;
  recientes: Lead[];
  proximosCierres: OportunidadConLead[];
};

export type FiltrosLeads = { q?: string; estado?: string; etiqueta?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function lanzarSiError(error: { message: string } | null, contexto: string) {
  if (error) throw new Error(`No se pudo leer ${contexto}: ${error.message}`);
}

function aplanarEtiquetas(
  filas: { etiquetas: Etiqueta | null }[],
): Etiqueta[] {
  return filas
    .map((f) => f.etiquetas)
    .filter((e): e is Etiqueta => e !== null)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export async function obtenerLeads(filtros: FiltrosLeads = {}): Promise<LeadConEtiquetas[]> {
  const db = crearClienteServidor();

  let consulta = db
    .from("leads")
    .select("*, lead_etiquetas(etiquetas(*))")
    .order("created_at", { ascending: false });

  if (filtros.estado && (ESTADOS as readonly string[]).includes(filtros.estado)) {
    consulta = consulta.eq("estado", filtros.estado);
  }

  // Quitamos los caracteres que tienen significado especial en el filtro de PostgREST.
  const q = filtros.q?.replace(/[,()%*\\]/g, " ").trim();
  if (q) {
    consulta = consulta.or(`nombre.ilike.%${q}%,email.ilike.%${q}%,empresa.ilike.%${q}%`);
  }

  if (filtros.etiqueta && UUID.test(filtros.etiqueta)) {
    const { data, error } = await db
      .from("lead_etiquetas")
      .select("lead_id")
      .eq("etiqueta_id", filtros.etiqueta);
    lanzarSiError(error, "las etiquetas de los leads");
    const ids = (data ?? []).map((f) => f.lead_id);
    if (ids.length === 0) return [];
    consulta = consulta.in("id", ids);
  }

  const { data, error } = await consulta;
  lanzarSiError(error, "los leads");

  return (data ?? []).map(({ lead_etiquetas, ...lead }) => ({
    ...lead,
    etiquetas: aplanarEtiquetas(lead_etiquetas),
  }));
}

/** Devuelve null si el id no es válido o el lead no existe. */
export async function obtenerFichaLead(id: string): Promise<FichaDeLead | null> {
  if (!UUID.test(id)) return null;
  const db = crearClienteServidor();

  const [lead, oportunidades, notas] = await Promise.all([
    db.from("leads").select("*, lead_etiquetas(etiquetas(*))").eq("id", id).maybeSingle(),
    db.from("oportunidades").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    db.from("notas").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  lanzarSiError(lead.error, "el lead");
  lanzarSiError(oportunidades.error, "las oportunidades del lead");
  lanzarSiError(notas.error, "las notas del lead");
  if (!lead.data) return null;

  const { lead_etiquetas, ...datos } = lead.data;
  return {
    lead: { ...datos, etiquetas: aplanarEtiquetas(lead_etiquetas) },
    oportunidades: oportunidades.data ?? [],
    notas: notas.data ?? [],
  };
}

export async function obtenerNotasDeLead(leadId: string): Promise<Nota[]> {
  if (!UUID.test(leadId)) return [];
  const { data, error } = await crearClienteServidor()
    .from("notas")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  lanzarSiError(error, "las notas");
  return data ?? [];
}

export async function obtenerOportunidades(): Promise<OportunidadConLead[]> {
  const db = crearClienteServidor();
  const { data, error } = await db
    .from("oportunidades")
    .select("*, leads(id, nombre, empresa)")
    .order("valor", { ascending: false });
  lanzarSiError(error, "las oportunidades");

  return (data ?? []).map(({ leads, ...oportunidad }) => ({ ...oportunidad, lead: leads }));
}

export async function obtenerEtiquetas(): Promise<EtiquetaConTotal[]> {
  const db = crearClienteServidor();
  const { data, error } = await db
    .from("etiquetas")
    .select("*, lead_etiquetas(count)")
    .order("nombre", { ascending: true });
  lanzarSiError(error, "las etiquetas");

  return (data ?? []).map(({ lead_etiquetas, ...etiqueta }) => ({
    ...etiqueta,
    totalLeads: lead_etiquetas[0]?.count ?? 0,
  }));
}

/** Solo lo que hace falta para elegir un lead en un desplegable. */
export async function obtenerResumenLeads(): Promise<LeadResumen[]> {
  const { data, error } = await crearClienteServidor()
    .from("leads")
    .select("id, nombre, empresa")
    .order("nombre", { ascending: true });
  lanzarSiError(error, "los leads");
  return data ?? [];
}

/** Solo lo que hace falta para rellenar el selector de etiquetas del filtro. */
export async function obtenerCatalogoEtiquetas(): Promise<Etiqueta[]> {
  const db = crearClienteServidor();
  const { data, error } = await db.from("etiquetas").select("*").order("nombre", { ascending: true });
  lanzarSiError(error, "las etiquetas");
  return data ?? [];
}

export async function obtenerMetricas(): Promise<Metricas> {
  const db = crearClienteServidor();
  const [leads, oportunidades] = await Promise.all([
    db.from("leads").select("*").order("created_at", { ascending: false }),
    db.from("oportunidades").select("*, leads(id, nombre, empresa)"),
  ]);
  lanzarSiError(leads.error, "los leads");
  lanzarSiError(oportunidades.error, "las oportunidades");

  const listaLeads = leads.data ?? [];
  const listaOportunidades = (oportunidades.data ?? []).map(({ leads: lead, ...o }) => ({ ...o, lead }));

  const leadsPorEstado = Object.fromEntries(ESTADOS.map((e) => [e, 0])) as Record<Estado, number>;
  for (const lead of listaLeads) {
    if (lead.estado in leadsPorEstado) leadsPorEstado[lead.estado as Estado] += 1;
  }

  const porFase = FASES.map((fase) => {
    const deLaFase = listaOportunidades.filter((o) => o.fase === fase);
    return { fase, cantidad: deLaFase.length, valor: deLaFase.reduce((suma, o) => suma + o.valor, 0) };
  });

  const valorPipelineAbierto = porFase
    .filter((f) => FASES_ABIERTAS.includes(f.fase))
    .reduce((suma, f) => suma + f.valor, 0);
  const valorGanado = porFase.find((f) => f.fase === "ganada")?.valor ?? 0;

  const proximosCierres = listaOportunidades
    .filter((o) => FASES_ABIERTAS.includes(o.fase as Fase) && o.cierre_estimado)
    .sort((a, b) => (a.cierre_estimado ?? "").localeCompare(b.cierre_estimado ?? ""))
    .slice(0, 5);

  return {
    totalLeads: listaLeads.length,
    leadsPorEstado,
    porFase,
    valorPipelineAbierto,
    valorGanado,
    recientes: listaLeads.slice(0, 5),
    proximosCierres,
  };
}
