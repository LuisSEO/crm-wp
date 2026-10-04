# AGENTS.md — Cómo trabajar con la IA en este proyecto

`AGENTS.md` es un **estándar abierto**: muchas herramientas de IA (Claude Code, Cursor, etc.) lo leen para saber cómo deben comportarse en un proyecto. Es hermano de `CLAUDE.md`: aquí van las **reglas de trabajo**; en `CLAUDE.md`, el **qué es** el proyecto y su arquitectura.

> Para no-devs: esto es "el manual de instrucciones para tu empleado de IA". Le dice cómo queremos que trabaje.

## Los dos principios que mandan

1. **Planificar antes de ejecutar.** Para cualquier cambio que no sea trivial, primero propón un plan (en Claude Code: plan mode, Shift+Tab x2). El humano revisa y aprueba. No toques producción sin plan aprobado.
2. **Siempre una forma de probar.** Después de construir, hay que comprobarlo. En este proyecto **lo prueba el humano a mano**: abre la web y verifica que el formulario guarda y la lista se actualiza. Nada se da por bueno sin verlo funcionar.

## El ciclo de trabajo

```
1. Objetivo   — el humano dice qué quiere ("añade un campo teléfono al formulario")
2. Plan       — la IA propone los pasos (skill crear-plan); el humano aprueba
3. Construir  — la IA edita los archivos (skill implementar)
4. Probar     — el HUMANO abre la web y comprueba que funciona
5. Aprobar    — el humano da el visto bueno y se pasa a la siguiente fase
```

## Cómo usar las skills

Antes de escribir algo desde cero, mira si hay una skill que lo cubra (en `.claude/skills/`). Si falta una capacidad, búscala en el marketplace con la skill `find-skills` y enchúfala. Reutilizar > reinventar.

- Escribir textos / copy → skill `copywriting`
- Diseño de pantallas → skill `frontend-design` (sigue `design.md`)
- Estructura y patrones de Next.js → skill `nextjs-app-router-patterns`
- Rendimiento y buenas prácticas React/Next → skill `vercel-react-best-practices`
- Base de datos (tablas, RLS, Postgres) → skill `supabase-postgres-best-practices`
- Buscar nuevas skills → skill `find-skills`

## Reglas que no se saltan

- **Secretos:** nunca escribas claves en el código. Van en `.env`. Nunca subas `.env` (está en `.gitignore`). Si una clave se filtra, hay que rotarla.
- **Seguridad de datos:** la clave `service_role` de Supabase jamás llega al frontend. RLS activado siempre.
- **Idioma:** español de España en la interfaz. Sin emojis salvo petición.
- **Cambios pequeños y revisables:** prefiere pasos cortos que el humano pueda entender, probar y aprobar, no un volcado gigante.

## Para el humano que dirige

No necesitas teclear comandos de memoria. Tu trabajo: dar objetivos claros, leer el plan, aprobar, y **probar el resultado a mano**. Si no entiendes algo que propone la IA, pídele que te lo explique en cristiano antes de aprobar.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
