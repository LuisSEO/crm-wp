# lib/ — Utilidades (la conexión a la base de datos)

Aquí van utilidades que usan varias partes del proyecto. La principal: la **conexión con Supabase** (la pieza 3, la base de datos).

## Qué va aquí

- `supabase.ts` → crea la conexión a Supabase usando las claves del `.env`.

El backend (`app/api/`) importa esta conexión para guardar y leer los datos del CRM (leads, etiquetas, oportunidades y notas).

## Importante (seguridad)

- Las claves se leen del `.env`, **nunca** se escriben aquí a mano.
- La clave `service_role` solo se usa en el servidor, jamás en el frontend. Ver skill `supabase-postgres-best-practices`.

## Skill que ayuda

`supabase-postgres-best-practices`.

## Qué pedirle a la IA

"Crea en `lib/supabase.ts` la conexión a Supabase leyendo las claves del `.env`."
