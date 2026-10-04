/*
  Llamadas a la API desde el navegador (formularios y botones).
  Si la API responde con error, se lanza un ErrorApiCliente con el mensaje y los errores por campo.
*/

export class ErrorApiCliente extends Error {
  constructor(
    mensaje: string,
    public campos: Record<string, string> = {},
  ) {
    super(mensaje);
  }
}

export async function llamarApi<T>(url: string, metodo: "POST" | "PATCH" | "PUT", cuerpo: unknown): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new ErrorApiCliente("No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  }
  const json = (await respuesta.json().catch(() => null)) as { datos?: T; error?: string; campos?: Record<string, string> } | null;
  if (!respuesta.ok || !json || json.datos === undefined) {
    throw new ErrorApiCliente(json?.error ?? "No se pudo completar la acción. Inténtalo de nuevo.", json?.campos);
  }
  return json.datos;
}
