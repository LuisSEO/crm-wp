# Plan maestro · CRM de leads

Este es el plan grande del proyecto: QUÉ vamos a construir, CÓMO, con QUÉ y en qué ORDEN. La IA lo lee para situarse. Cada fase tendrá luego su propio plan detallado en `Plans/NN-xxx.md`.

> Regla de oro del curso: **planear → implementar → probar → repetir.** Una fase cada vez. El testeo lo hace el humano a mano. Nada se da por bueno sin verlo funcionar.

## 1. Qué vamos a construir

Un **CRM** de verdad para captar y **gestionar** clientes potenciales. No es un formulario suelto: tiene varios apartados.

- **Dashboard** — métricas: nº de leads, oportunidades por fase y valor total del pipeline.
- **Leads** — lista con búsqueda y filtros (por estado y por etiqueta), y ficha de cada lead.
- **Etiquetas** — poner etiquetas a los leads para clasificarlos (cliente VIP, frío, evento X…).
- **Oportunidades** — los negocios abiertos, organizados en un **pipeline por fases** (con su valor en €).
- **Notas** — el seguimiento escrito de cada lead.

## 2. Los apartados de la app (lo que verá el usuario)

| Apartado | Qué hace |
|----------|----------|
| **Dashboard** | Los números clave de un vistazo. |
| **Leads** | Lista filtrable + ficha (datos, etiquetas, notas y sus oportunidades). |
| **Oportunidades** | Tablero del pipeline por fases; mover una oportunidad de fase. |
| **Etiquetas** | Gestionar el catálogo de etiquetas (nombre y color). |

## 3. Funcionalidades (alcance de la primera versión)

- [ ] Crear y editar leads (estado: nuevo / cualificado / descartado).
- [ ] Etiquetar leads (un lead puede tener varias etiquetas).
- [ ] Crear oportunidades ligadas a un lead, con valor y fase, y moverlas por el pipeline.
- [ ] Añadir notas a un lead.
- [ ] Lista de leads con buscar + filtrar por estado y por etiqueta.
- [ ] Dashboard con métricas (leads, oportunidades por fase, valor del pipeline).
- [ ] Publicado y accesible por un enlace.
- Fuera de alcance (más adelante): login/usuarios, importar/exportar CSV, emails automáticos, asignación a comerciales.

## 4. Modelo de datos (5 tablas)

- **`leads`** — id, nombre, email, telefono, empresa, **estado** (nuevo/cualificado/descartado), origen, created_at.
- **`etiquetas`** — id, nombre, color. El catálogo de etiquetas.
- **`lead_etiquetas`** — lead_id (FK a leads), etiqueta_id (FK a etiquetas). Tabla puente: relación **muchos-a-muchos** (un lead tiene varias etiquetas y una etiqueta marca varios leads).
- **`oportunidades`** — id, lead_id (FK a leads), titulo, valor, **fase** (contactado/propuesta/negociacion/ganada/perdida), cierre_estimado, created_at. Un lead puede tener varias oportunidades.
- **`notas`** — id, lead_id (FK a leads), texto, created_at. Un lead tiene muchas notas.

Relaciones: `leads` **1—N** `notas` · `leads` **1—N** `oportunidades` · `leads` **N—M** `etiquetas` (a través de `lead_etiquetas`).

## 5. El orden (las fases)

Construimos de dentro hacia fuera. Primero los datos, luego la cara, luego el cableado, luego a producción.

1. **Modelo de datos** → las 5 tablas en Supabase, con sus relaciones y RLS. *(Plan: `01-modelo-datos.md`)*
2. **Frontend** → los apartados (dashboard, leads con ficha, oportunidades/pipeline, etiquetas), siguiendo `design.md`. *(Plan: `02-frontend.md`)*
3. **Backend** → las rutas de API: leads, etiquetas, oportunidades (cambiar de fase), notas y métricas. *(Plan: `03-backend.md`)*
4. **Producción** → publicar en Vercel desde GitHub. *(Plan: `04-produccion.md`)*

> Nosotros vamos **frontend antes que backend** a propósito: así vemos pronto algo en pantalla. Hay quien prefiere al revés; las dos vías valen.

## 6. Cómo trabaja la IA en cada fase

Para cada fase: la skill `crear-plan` escribe el plan detallado → el humano lo aprueba → la skill `implementar` lo construye → **el humano lo prueba a mano** (abre la web). Si algo falla, se vuelve atrás. Reutilizamos las skills reales (`supabase-postgres-best-practices`, `nextjs-app-router-patterns`, `frontend-design`, `copywriting`) antes de escribir desde cero; si falta una, la buscamos con `find-skills`.

## 7. Decisiones abiertas (para el humano)

- Paleta y tipografía → las del `design.md` (ElevenLabs).
- ¿Fases definitivas del pipeline? (de momento: contactado/propuesta/negociacion/ganada/perdida).
- ¿Estados del lead definitivos? (de momento: nuevo/cualificado/descartado).
- ¿Login en una v2? (de momento, no).

---

**Estado:** plan maestro listo. Siguiente paso: `crear-plan` para la fase 1 (modelo de datos: las 5 tablas).
