# Plan · Fase 1 — Modelo de datos en Supabase

## Objetivo
Crear en Supabase las 5 tablas del CRM (leads, etiquetas, lead_etiquetas, oportunidades, notas) con sus relaciones, restricciones, índices y seguridad (RLS), más unos datos de ejemplo para poder probar el dashboard y los filtros en las fases siguientes.

## Decisiones tomadas
- **Estados del lead:** nuevo / cualificado / descartado.
- **Fases del pipeline:** contactado / propuesta / negociacion / ganada / perdida.
- **Validación:** columnas de texto con restricción CHECK (fácil de cambiar después), no enums de Postgres.
- **Seguridad:** RLS activado en las 5 tablas **sin políticas públicas**. Solo el backend (`app/api/`) accede con la clave `service_role`, que nunca llega al navegador.
- **Datos de ejemplo:** sí, un seed con contenido realista.

## Qué piezas toca
- [x] Base de datos (Supabase)
- [ ] Frontend
- [ ] Backend
- [ ] Producción

## Pasos (pequeños y verificables)
1. **Conectar con Supabase** — autorizar el MCP de Supabase y elegir el proyecto de destino. **Se comprueba:** la IA lista las tablas del proyecto (vacío o sin las nuestras) sin errores.
2. **Crear `leads` y `etiquetas`** (tablas sin dependencias). Leads con estado (CHECK), `created_at` por defecto, email único opcional. Etiquetas con nombre único y color. **Se comprueba:** ambas tablas aparecen en el Table Editor con las columnas correctas.
3. **Crear `lead_etiquetas`** (tabla puente). Clave primaria compuesta (lead_id, etiqueta_id), claves foráneas con borrado en cascada. **Se comprueba:** no deja repetir la misma etiqueta en un lead ni apuntar a un lead inexistente.
4. **Crear `oportunidades` y `notas`**. FK a leads con borrado en cascada; fase (CHECK); valor numérico no negativo; `cierre_estimado` como fecha. **Se comprueba:** una fase inválida o un valor negativo es rechazado.
5. **Índices** en las claves foráneas (lead_id, etiqueta_id) y en estado y fase, para que lista, filtros y dashboard vayan rápido. **Se comprueba:** aparecen listados en la base de datos.
6. **Activar RLS** en las 5 tablas, sin políticas públicas. **Se comprueba:** el asesor de seguridad de Supabase no marca tablas sin RLS y una consulta con la clave pública (anon) no devuelve datos.
7. **Datos de ejemplo (seed)**: ~8 leads de distintos estados, ~5 etiquetas con color, asignaciones de etiquetas, ~10 oportunidades repartidas por todas las fases y ~15 notas. **Se comprueba:** en el Table Editor se ven los datos y las relaciones cuadran (cada oportunidad y nota pertenece a un lead).
8. **Guardar las migraciones y las claves**: las migraciones quedan aplicadas en Supabase (con nombre) y se copia el SQL a una carpeta del repo. Las claves van a `.env`, nunca al código ni a GitHub: la URL del proyecto, la **anon key** (pública, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; en la v1 no da acceso a datos por el RLS, queda lista para una v2 con login) y la **service_role** (secreta, solo servidor, sin prefijo `NEXT_PUBLIC_`). **Se comprueba:** `.env` existe, está en `.gitignore` y la anon key no puede leer ninguna tabla.

## Skills que usaremos
- `supabase-postgres-best-practices` (tipos, índices, RLS).
- `anthropic-skills:supabase-sql` si hace falta para el SQL.
- MCP de Supabase para aplicar migraciones y revisar el asesor de seguridad.

## Riesgos / dudas para el humano
- El MCP de Supabase **aún no está autorizado** en esta sesión: hay que hacerlo con `/mcp` antes del paso 1.
- ¿Usamos un proyecto de Supabase existente o creamos uno nuevo? (hay que decidirlo en el paso 1; crear uno puede tener coste).
- Con RLS sin políticas, el frontend no puede leer directamente de Supabase: todo pasa por la API (fase 3). Hasta entonces, el frontend de la fase 2 trabajará con datos de ejemplo o el seed se verá solo en el panel de Supabase.
- Borrado en cascada: borrar un lead borra sus notas, oportunidades y etiquetas asignadas. Es lo esperado, pero conviene confirmarlo.

## Hecho cuando
Las 5 tablas existen en Supabase con relaciones, restricciones, índices y RLS activo; el seed se ve correctamente en el Table Editor; el asesor de seguridad no da avisos críticos; y las claves están en `.env`, comprobado a mano por ti en el panel de Supabase.
