export const ESTADOS = ["nuevo", "cualificado", "descartado"] as const;
export type Estado = (typeof ESTADOS)[number];

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  nuevo: "Nuevo",
  cualificado: "Cualificado",
  descartado: "Descartado",
};

export const FASES = ["contactado", "propuesta", "negociacion", "ganada", "perdida"] as const;
export type Fase = (typeof FASES)[number];

export const ETIQUETA_FASE: Record<Fase, string> = {
  contactado: "Contactado",
  propuesta: "Propuesta",
  negociacion: "Negociación",
  ganada: "Ganada",
  perdida: "Perdida",
};

/** Fases en las que el negocio sigue abierto (cuentan para el valor del pipeline). */
export const FASES_ABIERTAS: readonly Fase[] = ["contactado", "propuesta", "negociacion"];
