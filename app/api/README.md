# app/api/ — El backend (el cerebro)

Esta carpeta es la **pieza 2: el backend**. Aquí viven las **funciones** que reciben lo que pide el frontend y hablan con la base de datos. El usuario no las ve.

> En Next.js, el backend vive dentro de `app/api/`. Cada carpeta es un "endpoint" (una dirección a la que el frontend le pide cosas).

## Qué va aquí

- `app/api/leads/` → crear un lead (POST) y listar/buscar/filtrar leads (GET).
- `app/api/leads/[id]/` → ver y editar un lead, cambiar su estado, y asignarle/quitarle etiquetas.
- `app/api/etiquetas/` → listar y crear etiquetas.
- `app/api/oportunidades/` → crear y listar oportunidades; `oportunidades/[id]` → cambiar su fase o su valor.
- `app/api/notas/` → añadir una nota a un lead y listar sus notas.
- `app/api/metricas/` → los números del dashboard (leads, oportunidades por fase, valor del pipeline).
- Usan la conexión a la base de datos que está en `lib/`.

## Pieza relacionada

Backend → corre en un servidor → **privado**. Aquí sí pueden vivir cosas sensibles (pero las claves siguen en `.env`).

## Skill que ayuda

`supabase-postgres-best-practices` (para guardar y leer bien) y `nextjs-app-router-patterns` (cómo se montan las rutas).

## Qué pedirle a la IA

"Crea las API: leads (crear/listar/filtrar y editar/estado/etiquetas), etiquetas, oportunidades (con cambio de fase), notas y métricas."
