import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./tipos-bd";

/**
 * Cliente de Supabase SOLO para el servidor, con la clave maestra (service_role).
 * El import "server-only" hace que el proyecto no compile si algún componente del navegador lo importa.
 */
export function crearClienteServidor() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !clave) {
    throw new Error(
      "Falta la conexión con la base de datos. Rellena NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el archivo .env.",
    );
  }

  return createClient<Database>(url, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
