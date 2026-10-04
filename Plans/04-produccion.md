# Plan · Fase 4 — Producción

## Objetivo
Publicar el CRM en internet con un enlace público, desplegado en **Vercel** desde un repositorio de **GitHub**, conectado a la base de datos de Supabase. Para quien gestiona los leads (y para poder enseñarlo). Al terminar, cada cambio subido a GitHub se publica solo.

## Punto de partida
- Las fases 1 a 3 están hechas; la fase 3 queda pendiente de tu **prueba manual en el navegador** y tu visto bueno (conviene cerrarla antes de publicar).
- La carpeta **no es un repositorio git** todavía y no hay repo en GitHub.
- No están instalados `gh` (GitHub CLI) ni `vercel` (CLI de Vercel). Sí hay `git` y Node.
- `.env` está en `.gitignore` (bien). Variables necesarias: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` (solo servidor).
- El conector de GitHub en `.mcp.json` usa un token (`GITHUB_PAT`) que hay que tener definido.
- **Sin login:** las rutas de escritura de `app/api/` están abiertas (riesgo anotado en la fase 3).

## Qué piezas toca
- [ ] Frontend / Backend: solo ajustes menores si el build de producción falla
- [ ] Base de datos: solo comprobaciones (RLS y avisos de seguridad); sin cambios previstos
- [x] Producción: git, GitHub, Vercel, variables de entorno

## Pasos (pequeños y verificables)
1. **Protección de la app publicada** (según tu decisión abajo): contraseña compartida simple o publicar solo con datos de ejemplo. — **se comprueba:** sin la contraseña no se ve ni se puede escribir en la API.
2. **Revisión previa a publicar:** `npm run build` y `npm run lint` sin errores; búsqueda en el código de claves escritas a mano; confirmar que `.env` no se sube; RLS activado en las 5 tablas y asesor de seguridad de Supabase sin avisos críticos. — **se comprueba:** build verde y informe del asesor limpio.
3. **Repositorio git local:** `git init`, primer commit con `.env.example` pero sin `.env`, `node_modules` ni `.next`. — **se comprueba:** la lista de archivos del commit no contiene ningún secreto.
4. **Repositorio en GitHub:** crearlo (privado por defecto) y subir el código. — **se comprueba:** el repo se ve en GitHub, sin `.env`.
5. **Proyecto en Vercel:** importar el repo, framework Next.js detectado, región cercana a Supabase. — **se comprueba:** Vercel lanza el primer despliegue.
6. **Variables de entorno en Vercel:** las tres claves, la clave maestra solo como variable de servidor (sin `NEXT_PUBLIC_`). — **se comprueba:** el despliegue termina en verde y la app carga datos reales.
7. **Prueba en producción, a mano (tú):** abrir el enlace, recorrer dashboard, leads, ficha, etiquetas, oportunidades y arrastre; crear y editar algo; probar en el móvil. — **se comprueba:** todo funciona igual que en local y no hay errores en los registros de Vercel.
8. **Despliegue continuo:** un cambio pequeño subido a GitHub se publica solo. — **se comprueba:** el cambio aparece en el enlace sin tocar nada más.
9. **Cierre:** anotar el enlace público en `README.md`, marcar el plan maestro como terminado y apuntar cómo rotar claves si se filtraran. — **se comprueba:** README actualizado.

## Skills que usaremos
`vercel-react-best-practices` (revisión del build), `nextjs-app-router-patterns` (variables de entorno, rutas en producción), `supabase-postgres-best-practices` (RLS y claves), conectores de GitHub y Supabase.

## Riesgos / dudas para el humano
- **Seguridad sin login (decisión necesaria):** publicada, cualquiera con el enlace podría ver y modificar datos. Opciones: (a) contraseña compartida simple (recomendada, poco trabajo), (b) publicar solo con datos de ejemplo y enlace privado, (c) hacer antes un login completo (fase extra, fuera de alcance de la v1).
- **Datos reales o de ejemplo:** ahora la base tiene datos de ejemplo. ¿Usamos la misma base en producción o creamos un proyecto Supabase aparte para producción? Con una sola, lo que pruebes en la web publicada afecta a los mismos datos.
- **Herramientas que faltan:** hay que instalar `gh` y/o `vercel`, o hacerlo desde las webs de GitHub y Vercel. Necesitaré que tú inicies sesión (se abre el navegador) y me confirmes antes de crear el repo y de pegar claves.
- **Claves:** nunca se pegan en el chat; las introduces tú en Vercel o las gestiono con tu confirmación explícita.
- **Dominio propio:** no incluido; se usa el `.vercel.app`.
- **Plan gratuito de Supabase:** pausa proyectos inactivos; si la web deja de cargar datos tras días sin uso, habrá que reactivarlo.

## Estado
- Paso 1 (protección con contraseña): **pendiente de tu decisión**, no implementado.
- Paso 2 (revisión previa): hecho. Lint y build sin errores; RLS activado en las 5 tablas; la clave maestra solo aparece en `lib/supabase-servidor.ts`; el asesor de Supabase solo da un aviso informativo (tablas sin políticas, esperado en este diseño).
- Pasos 3 y 4: el código se ha subido a `LuisSEO/crm-wp` (rama `main`) con el conector de GitHub, sin usar git local. Quedan fuera del repositorio: `.env`, `node_modules`, `.next`, `.claude/skills/` (se reinstalan con `skills-lock.json`), `package-lock.json` y `app/favicon.ico` (el conector solo envía texto). Hay que subirlos aparte.
- Pasos 5 a 9 (Vercel): para otra fase, como has indicado.

## Hecho cuando
El CRM abre desde un enlace público de Vercel, protegido según lo que decidas, muestra y guarda datos reales de Supabase, no hay ninguna clave secreta en el repositorio ni en el navegador, un cambio subido a GitHub se publica solo, y has recorrido la web publicada a mano dando tu visto bueno.
