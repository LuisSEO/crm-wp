# CRM de leads — Kit de inicio

Este es el manual del proyecto. Cuando la IA (Claude Code) abre esta carpeta, lee este archivo primero para entender QUÉ estamos construyendo, CÓMO está organizado y QUÉ reglas seguir.

> Si no programas: no pasa nada. Tu trabajo es entender este mapa, pedirle a la IA lo que quieres y aprobar lo que hace. Las reglas de CÓMO trabajar con la IA están en `AGENTS.md`.

## Qué es este proyecto

Un **CRM** de verdad para captar y **gestionar** clientes potenciales. No es un formulario suelto: tiene varios apartados.

- **Dashboard** — métricas de un vistazo: nº de leads, oportunidades por fase y valor del pipeline.
- **Leads** — lista con búsqueda y filtros (por estado y por etiqueta), y ficha de cada lead.
- **Etiquetas** — clasificar los leads con etiquetas (un lead puede tener varias).
- **Oportunidades** — los negocios abiertos, organizados en un **pipeline por fases**, con su valor.
- **Notas** — el seguimiento escrito de cada lead.

## Las 3 piezas y dónde viven aquí

| Pieza | Qué hace | Dónde está en este repo |
|-------|----------|--------------------------|
| **Frontend** (lo que ves) | Los apartados: dashboard, leads (lista + ficha), oportunidades (pipeline), etiquetas | `app/` + `components/` |
| **Backend** (el cerebro) | Crear/editar leads, etiquetar, mover oportunidades de fase, añadir notas, métricas | `app/api/` |
| **Base de datos** (la memoria) | Guarda leads, etiquetas, oportunidades y notas | Supabase (conexión en `lib/`) |

Se comunican por **APIs** (el frontend le pide al backend, el backend habla con la base de datos). Detalle en cada `README.md` de carpeta.

## Modelo de datos (resumen) — 5 tablas

- **`leads`** — id, nombre, email, telefono, empresa, **estado** (nuevo/cualificado/descartado), origen, created_at.
- **`etiquetas`** — id, nombre, color. El catálogo de etiquetas.
- **`lead_etiquetas`** — lead_id, etiqueta_id. Tabla puente: un lead tiene **varias etiquetas** (relación muchos-a-muchos).
- **`oportunidades`** — id, lead_id, titulo, valor, **fase** (contactado/propuesta/negociacion/ganada/perdida), cierre_estimado, created_at. Un lead tiene varias oportunidades.
- **`notas`** — id, lead_id, texto, created_at. Un lead tiene muchas notas.

Relaciones: `leads` **1—N** `notas` · `leads` **1—N** `oportunidades` · `leads` **N—M** `etiquetas` (vía `lead_etiquetas`).

## Stack (las herramientas que usamos)

- **Next.js** (sobre Node.js) — front y back en un solo proyecto.
- **Supabase** — la base de datos (Postgres), lista para usar.
- **Vercel** — donde se publica en internet.

## Documentos clave del sistema

| Archivo | Para qué |
|---------|----------|
| `CLAUDE.md` (este) | Qué es el proyecto y su arquitectura. |
| `AGENTS.md` | Cómo trabaja la IA: planificar → implementar → (probar) → aprobar. |
| `design.md` | Cómo se ve la app (sistema de diseño real de ElevenLabs). La IA lo lee al hacer el frontend. |
| `Plans/` | Los planes. Empieza por `Plans/00-plan-maestro.md`. Cada fase tiene el suyo. |
| `docs/conectores.md` | Cómo enchufar Supabase y GitHub a Claude Code (por terminal). |

## Skills disponibles

En `.claude/skills/`. Las de **metodología** vienen en el kit; las de **dominio** son reales, sacadas del marketplace **skills.sh** con `npx skills add` y guardadas tal cual.

**Del marketplace (skills.sh):**

| Skill | Para qué | De dónde |
|-------|----------|---------|
| `copywriting` | Escribir bien: titulares, textos y CTAs que convierten. | `coreyhaines31/marketingskills` |
| `frontend-design` | Buenos diseños: dirección visual y tipografía, que no parezca plantilla. | `anthropics/skills` |
| `nextjs-app-router-patterns` | Next.js (App Router): cómo estructurar y construir la app. | `wshobson/agents` |
| `vercel-react-best-practices` | Rendimiento y buenas prácticas de React/Next. | `vercel-labs/agent-skills` |
| `supabase-postgres-best-practices` | Base de datos: Supabase y Postgres bien hechos. | `supabase/agent-skills` |
| `find-skills` | Buscar y traer más skills de skills.sh. | (kit) |

**De metodología (el ciclo de trabajo):**

| Skill | Para qué |
|-------|----------|
| `crear-plan` | Convierte un objetivo en un plan por fases y lo guarda en `Plans/`. |
| `implementar` | Construye UNA fase del plan, pequeña y revisable. |

> El **testeo lo hace el humano, a mano**: después de cada fase, abres la web y compruebas que funciona antes de aprobar. No hay skill de testear.

## Reglas del proyecto

1. **Planificar, luego ejecutar.** Antes de cambios serios, la IA propone un plan (skill `crear-plan`, plan mode) y tú lo apruebas.
2. **Siempre probar.** Tras construir una fase, **el humano la prueba a mano** en el navegador antes de darla por buena.
3. **Secretos fuera del código.** Las claves van en `.env` y `.env` NUNCA se sube a GitHub (está en `.gitignore`).
4. **La base de datos, con la puerta cerrada.** RLS activado; la clave maestra (service_role) jamás en el frontend. Ver skill `supabase-postgres-best-practices`.
5. **Español de España** en todos los textos de la app. Sin emojis salvo que se pidan.

## Cómo está pensado el flujo

Defines el cerebro (este archivo + `AGENTS.md` + `design.md`) → enchufas los conectores (`docs/conectores.md`) → escribes el plan grande (`Plans/00-plan-maestro.md`) → construyes cada fase: la IA **planifica** e **implementa**, y **tú la pruebas a mano** y apruebas → lo publicas. No se construye desde cero: se ensambla.
