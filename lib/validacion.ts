import { z } from "zod";
import { ESTADOS, FASES } from "./constantes";

/*
  Esquemas de validación de todo lo que entra por la API.
  Los mensajes están en español: son los que ve la persona en los formularios.
*/

const MENSAJE_ID = "El identificador no es válido.";
export const id = z.uuid({ error: MENSAJE_ID });

/** Texto opcional: se recorta y, si queda vacío, se guarda como "sin dato" (null). */
const textoOpcional = (max: number) =>
  z
    .string({ error: "Debe ser un texto." })
    .trim()
    .max(max, `No puede superar los ${max} caracteres.`)
    .nullish()
    .transform((v) => (v ? v : null));

const nombre = z
  .string({ error: "El nombre es obligatorio." })
  .trim()
  .min(1, "El nombre es obligatorio.")
  .max(120, "El nombre no puede superar los 120 caracteres.");

const email = z
  .string({ error: "Debe ser un texto." })
  .trim()
  .max(200, "El email no puede superar los 200 caracteres.")
  .nullish()
  .transform((v) => (v ? v.toLowerCase() : null))
  .refine((v) => v === null || z.email().safeParse(v).success, "Escribe un email válido.");

const telefono = z
  .string({ error: "Debe ser un texto." })
  .trim()
  .max(30, "El teléfono no puede superar los 30 caracteres.")
  .nullish()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^[0-9+()\-.\s]{6,}$/.test(v), "Escribe un teléfono válido.");

const estado = z.enum(ESTADOS, { error: "El estado no es válido." });
const fase = z.enum(FASES, { error: "La fase no es válida." });

export const leadNuevo = z.object({
  nombre,
  email,
  telefono,
  empresa: textoOpcional(120),
  origen: textoOpcional(60),
  estado: estado.default("nuevo"),
});

/** Edición parcial: solo se tocan los campos que llegan. */
export const leadEdicion = z
  .object({
    nombre: nombre.optional(),
    email: email.optional(),
    telefono: telefono.optional(),
    empresa: textoOpcional(120).optional(),
    origen: textoOpcional(60).optional(),
    estado: estado.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, "No hay ningún cambio que guardar.");

export const etiquetasDeLead = z.object({
  etiquetas: z.array(id, { error: "Las etiquetas no son válidas." }).max(50, "Demasiadas etiquetas."),
});

export const etiquetaNueva = z.object({
  nombre: z
    .string({ error: "El nombre es obligatorio." })
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(40, "El nombre no puede superar los 40 caracteres."),
  color: z
    .string({ error: "El color no es válido." })
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "El color debe ser un código como #3b82f6.")
    .default("#6b7280"),
});

const titulo = z
  .string({ error: "El título es obligatorio." })
  .trim()
  .min(1, "El título es obligatorio.")
  .max(160, "El título no puede superar los 160 caracteres.");

const valor = z
  .number({ error: "El valor debe ser un número." })
  .min(0, "El valor no puede ser negativo.")
  .max(999_999_999, "El valor es demasiado grande.");

const cierre = z
  .string({ error: "La fecha no es válida." })
  .trim()
  .nullish()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), "La fecha no es válida.");

export const oportunidadNueva = z.object({
  lead_id: id,
  titulo,
  valor: valor.default(0),
  fase: fase.default("contactado"),
  cierre_estimado: cierre,
});

export const oportunidadEdicion = z
  .object({
    titulo: titulo.optional(),
    valor: valor.optional(),
    fase: fase.optional(),
    cierre_estimado: cierre.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, "No hay ningún cambio que guardar.");

export const notaNueva = z.object({
  lead_id: id,
  texto: z
    .string({ error: "La nota no puede estar vacía." })
    .trim()
    .min(1, "La nota no puede estar vacía.")
    .max(5000, "La nota no puede superar los 5000 caracteres."),
});

/** Convierte un error de Zod en { campo: mensaje } para mostrarlo junto a cada campo. */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const problema of error.issues) {
    const campo = problema.path.join(".") || "_";
    if (!(campo in campos)) campos[campo] = problema.message;
  }
  return campos;
}
