# app/ — El frontend (lo que ves)

Esta carpeta es la **pieza 1: el frontend**. Aquí viven los **apartados** que el usuario ve y toca.

> En Next.js, cada carpeta dentro de `app/` es una página. La página principal vive en `app/page.tsx`.

## Qué va aquí (los apartados del CRM)

- **Dashboard** — las métricas (nº de leads, oportunidades por fase, valor del pipeline).
- **Leads** — la lista (con buscador y filtros por estado y etiqueta) y la **ficha del lead** (datos, etiquetas, notas y sus oportunidades).
- **Oportunidades** — el **pipeline**: las oportunidades organizadas por fases, para moverlas.
- **Etiquetas** — gestionar el catálogo de etiquetas (nombre y color).
- Usa las piezas reutilizables de `components/` y pide/manda datos al backend (`app/api/`).

## Pieza relacionada

Frontend → corre en el navegador del usuario → **público** (todo lo que pongas aquí se ve).

## Skill que ayuda

`frontend-design` (para que se vea bien, siguiendo `design.md`). El testeo lo haces tú a mano: abres la web y compruebas.

## Qué pedirle a la IA

"Crea el dashboard, la lista de leads con filtros, la ficha del lead con etiquetas y notas, el pipeline de oportunidades y la gestión de etiquetas, siguiendo `design.md`."
