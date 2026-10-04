import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { erroresPorCampo, id } from "./validacion";

/*
  Ayudantes comunes de las rutas de API: respuestas con el mismo formato y errores claros en español.
  Éxito: { datos }  ·  Error: { error: "mensaje", campos?: { campo: "mensaje" } }
*/

/** Error pensado para mostrarse a la persona: lleva el código HTTP y, si aplica, el campo afectado. */
export class ErrorApi extends Error {
  constructor(
    public estado: 400 | 404 | 409,
    mensaje: string,
    public campos?: Record<string, string>,
  ) {
    super(mensaje);
  }
}

export function respuestaOk<T>(datos: T, estado: 200 | 201 = 200) {
  return NextResponse.json({ datos }, { status: estado });
}

function respuestaError(estado: number, mensaje: string, campos?: Record<string, string>) {
  return NextResponse.json({ error: mensaje, ...(campos ? { campos } : {}) }, { status: estado });
}

/** Un id de la URL que no tiene forma de id se trata como "no existe" (404). */
export function idDeRuta(valor: string, que: string): string {
  if (!id.safeParse(valor).success) throw new ErrorApi(404, `${que} no existe.`);
  return valor;
}

/** Lee el cuerpo JSON de la petición; si no es JSON válido, 400. */
export async function leerJson(peticion: Request): Promise<unknown> {
  try {
    return await peticion.json();
  } catch {
    throw new ErrorApi(400, "El cuerpo de la petición no es un JSON válido.");
  }
}

/** Valida con un esquema de Zod o lanza un 400 con el mensaje de cada campo. */
export function validar<T extends z.ZodType>(esquema: T, datos: unknown): z.output<T> {
  const resultado = esquema.safeParse(datos);
  if (!resultado.success) {
    const campos = erroresPorCampo(resultado.error);
    throw new ErrorApi(400, Object.values(campos)[0] ?? "Los datos no son válidos.", campos);
  }
  return resultado.data;
}

/** Ejecuta una ruta y convierte cualquier fallo en una respuesta de error ordenada. */
export async function manejar(accion: () => Promise<Response>): Promise<Response> {
  try {
    return await accion();
  } catch (e) {
    if (e instanceof ErrorApi) return respuestaError(e.estado, e.message, e.campos);
    // El detalle interno se queda en el log del servidor; a la persona no se le enseña.
    console.error(e);
    return respuestaError(500, "Ha ocurrido un error inesperado. Inténtalo de nuevo.");
  }
}
